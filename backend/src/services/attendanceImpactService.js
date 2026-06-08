// backend/src/services/attendanceImpactService.js
import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance.js';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Helper para encontrar o crear el documento de asistencia
 */
async function getOrCreateAttendanceDocument(courseId, date, session) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  let attendanceDoc = await Attendance.findOne({
    course: courseId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).session(session);

  if (!attendanceDoc) {
    attendanceDoc = new Attendance({
      course: courseId,
      date: startOfDay,
      takenBy: null,
      status: 'abierta',
      records: []
    });
    await attendanceDoc.save({ session });
  }

  return attendanceDoc;
}

/**
 * Helper para actualizar un registro de asistencia
 */
async function updateOrCreateRecord(attendanceDoc, studentId, newStatus, requestId, reviewedBy, session) {
  let record = attendanceDoc.records.find(
    r => r.student.toString() === studentId.toString()
  );

  const oldStatus = record ? record.status : null;
  const wasLocked = record ? record.lockedByRequest : false;

  if (record) {
    // Si ya existe y está bloqueado con L, no modificar
    if (record.lockedByRequest && record.status === 'L') {
      return { modified: false, reason: 'already_licence' };
    }
    
    record.status = newStatus;
    record.lockedByRequest = true;
    record.request = requestId;
    if (newStatus === 'L') {
      record.note = `Licencia aprobada mediante solicitud: ${requestId}`;
    } else if (newStatus === 'P') {
      record.note = `Presente por ausencia docente aprobada: ${requestId}`;
    }
  } else {
    attendanceDoc.records.push({
      student: studentId,
      status: newStatus,
      lockedByRequest: true,
      request: requestId,
      note: newStatus === 'L' 
        ? `Licencia aprobada mediante solicitud: ${requestId}`
        : `Presente por ausencia docente aprobada: ${requestId}`
    });
    record = attendanceDoc.records[attendanceDoc.records.length - 1];
  }

  attendanceDoc.takenBy = reviewedBy;
  await attendanceDoc.save({ session });

  return { modified: true, record, oldStatus, wasLocked };
}

/**
 * T15 - Aplica el impacto de una solicitud estudiantil aprobada
 */
export async function applyStudentApproval(request, session) {
  try {
    const { _id: requestId, student, affectedDetails, reviewedBy } = request;
    
    console.log(`[T15] Procesando solicitud estudiantil ${requestId} para el estudiante ${student}`);

    let modifiedCount = 0;

    for (const detail of affectedDetails) {
      const { course, date } = detail;
      
      // Obtener o crear documento de asistencia
      const attendanceDoc = await getOrCreateAttendanceDocument(course, date, session);
      
      // Actualizar o crear registro para este estudiante
      const { modified, record, oldStatus, wasLocked } = await updateOrCreateRecord(
        attendanceDoc, student, 'L', requestId, reviewedBy, session
      );

      if (modified) {
        modifiedCount++;
        
        // Registrar auditoría
        await AuditLog.create([{
          actor: reviewedBy,
          action: 'ATTENDANCE_UPDATED_BY_STUDENT_REQUEST',
          entityType: 'Attendance',
          entityId: attendanceDoc._id,
          metadata: {
            requestId: requestId,
            studentId: student,
            recordId: record._id,
            oldStatus: oldStatus,
            newStatus: 'L',
            wasLocked: wasLocked,
            courseId: course,
            date: date
          }
        }], { session });
      }
    }

    // Crear notificación (asumiendo modelo Notification)
    const Notification = mongoose.model('Notification');
    await Notification.create([{
      user: student,
      title: 'Solicitud Aprobada',
      message: `Tu solicitud de ausencia ha sido aprobada. Tus asistencias han sido marcadas como L (Licencia).`,
      type: 'REQUEST_APPROVED',
      read: false
    }], { session });

    console.log(`[T15] Solicitud estudiantil ${requestId} procesada. ${modifiedCount} registros actualizados.`);
    return { success: true, modifiedCount };

  } catch (error) {
    console.error('[T15] Error en applyStudentApproval:', error);
    throw error;
  }
}

/**
 * T16 - Aplica el impacto de una solicitud docente aprobada
 */
export async function applyTeacherAbsence(request, session) {
  try {
    const { _id: requestId, teacher, affectedCourses, affectedDates, reviewedBy } = request;
    
    console.log(`[T16] Procesando ausencia docente ${requestId}`);
    console.log(`[T16] Cursos afectados: ${affectedCourses.join(', ')}`);
    console.log(`[T16] Fechas afectadas: ${affectedDates.join(', ')}`);

    let totalRecordsModified = 0;
    const Course = mongoose.model('Course');
    const allAffectedStudents = new Set();

    for (const courseId of affectedCourses) {
      // Obtener estudiantes inscritos
      const course = await Course.findById(courseId).session(session);
      if (!course || !course.enrolledStudents) {
        console.warn(`[T16] Curso ${courseId} sin estudiantes inscritos`);
        continue;
      }

      const enrolledStudents = course.enrolledStudents;
      console.log(`[T16] Curso ${courseId} tiene ${enrolledStudents.length} estudiantes`);

      for (const date of affectedDates) {
        // Obtener documento de asistencia
        const attendanceDoc = await getOrCreateAttendanceDocument(courseId, date, session);
        
        for (const studentId of enrolledStudents) {
          // Verificar si ya tiene licencia (L) individual
          const existingRecord = attendanceDoc.records.find(
            r => r.student.toString() === studentId.toString()
          );
          
          // Si ya tiene L, no sobrescribir
          if (existingRecord && existingRecord.lockedByRequest && existingRecord.status === 'L') {
            console.log(`[T16] Estudiante ${studentId} ya tiene L, no se sobrescribe`);
            continue;
          }
          
          // Actualizar o crear registro como P
          const { modified, record } = await updateOrCreateRecord(
            attendanceDoc, studentId, 'P', requestId, reviewedBy, session
          );
          
          if (modified) {
            totalRecordsModified++;
            allAffectedStudents.add(studentId.toString());
            
            // Auditoría
            await AuditLog.create([{
              actor: reviewedBy,
              action: 'ATTENDANCE_UPDATED_BY_TEACHER_ABSENCE',
              entityType: 'Attendance',
              entityId: attendanceDoc._id,
              metadata: {
                requestId: requestId,
                teacherId: teacher,
                studentId: studentId,
                recordId: record._id,
                courseId: courseId,
                date: date
              }
            }], { session });
          }
        }
      }
    }

    // Notificar a estudiantes afectados
    if (allAffectedStudents.size > 0) {
      const Notification = mongoose.model('Notification');
      const notifications = Array.from(allAffectedStudents).map(studentId => ({
        user: studentId,
        title: 'Clase Afectada por Ausencia Docente',
        message: `La ausencia del docente ha sido aprobada. Tu asistencia ha sido marcada como Presente (P).`,
        type: 'TEACHER_ABSENCE_APPROVED',
        read: false
      }));
      
      await Notification.create(notifications, { session });
      console.log(`[T16] ${notifications.length} estudiantes notificados`);
    }

    console.log(`[T16] Ausencia docente procesada. ${totalRecordsModified} registros actualizados.`);
    return { success: true, totalRecordsModified };

  } catch (error) {
    console.error('[T16] Error en applyTeacherAbsence:', error);
    throw error;
  }
}