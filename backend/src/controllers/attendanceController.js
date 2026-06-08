// backend/src/controllers/attendanceController.js
import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance.js';
import { AuditLog } from '../models/AuditLog.js';

// Helper para validar fechas
const getStartAndEndOfDay = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Helper para obtener o crear registro de asistencia para un estudiante
async function getOrCreateAttendanceRecord(attendanceDoc, studentId, session) {
  let record = attendanceDoc.records.find(
    r => r.student.toString() === studentId.toString()
  );
  
  if (!record) {
    attendanceDoc.records.push({
      student: studentId,
      status: 'P',
      lockedByRequest: false,
      request: null,
      note: ''
    });
    record = attendanceDoc.records[attendanceDoc.records.length - 1];
    await attendanceDoc.save({ session });
  }
  
  return record;
}

// GET /api/attendance?courseId=...&date=...
export const getAttendanceByCourseAndDate = async (req, res) => {
  try {
    const { courseId, date } = req.query;
    const teacherId = req.user.id;

    if (!courseId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren courseId y date como parámetros de consulta'
      });
    }

    const { start, end } = getStartAndEndOfDay(date);
    
    // Buscar o crear el documento de asistencia para ese curso y fecha
    let attendanceDoc = await Attendance.findOne({
      course: courseId,
      date: { $gte: start, $lte: end }
    }).populate('records.student', 'name email');

    if (!attendanceDoc) {
      return res.status(200).json({
        success: true,
        data: {
          courseId,
          date,
          status: 'abierta',
          attendance: [] // Sin estudiantes aún
        }
      });
    }

    // Validar que el docente es el instructor (asumiendo que Course tiene teacher)
    const Course = mongoose.model('Course');
    const course = await Course.findById(courseId);
    if (course.teacher && course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver la asistencia de este curso'
      });
    }

    // Formatear respuesta
    const result = attendanceDoc.records.map(record => ({
      attendanceId: record._id,
      studentId: record.student._id,
      studentName: record.student.name,
      studentEmail: record.student.email,
      status: record.status,
      isLocked: record.lockedByRequest,
      lockedReason: record.request ? `Vinculado a solicitud: ${record.request}` : null,
      note: record.note,
      lastModifiedAt: attendanceDoc.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        courseId: attendanceDoc.course,
        date: attendanceDoc.date,
        status: attendanceDoc.status,
        takenBy: attendanceDoc.takenBy,
        attendance: result
      }
    });

  } catch (error) {
    console.error('Error en getAttendanceByCourseAndDate:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la asistencia',
      error: error.message
    });
  }
};

// PATCH /api/attendance/:recordId (actualizar un registro específico)
export const updateAttendance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const { status, note } = req.body;
    const teacherId = req.user.id;
    const teacherRole = req.user.role;

    if (!status || !['P', 'F'].includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Solo se permite P o F para docentes'
      });
    }

    // Buscar el documento de asistencia que contiene este registro
    const attendanceDoc = await Attendance.findOne({
      'records._id': recordId
    }).session(session);

    if (!attendanceDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Registro de asistencia no encontrado'
      });
    }

    // Encontrar el registro específico
    const record = attendanceDoc.records.id(recordId);
    if (!record) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado en el documento'
      });
    }

    // Verificar si está bloqueado por una solicitud
    if (record.lockedByRequest === true) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'No se puede modificar una licencia (L) aprobada. Solo un director puede modificarla con justificación.'
      });
    }

    // Verificar que el docente tiene permiso
    const Course = mongoose.model('Course');
    const course = await Course.findById(attendanceDoc.course).session(session);
    if (course.teacher && course.teacher.toString() !== teacherId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar la asistencia de este curso'
      });
    }

    const oldStatus = record.status;

    // Actualizar registro
    record.status = status;
    if (note) record.note = note;
    attendanceDoc.takenBy = teacherId;
    
    await attendanceDoc.save({ session });

    // Registrar auditoría usando tu modelo
    await AuditLog.create([{
      actor: teacherId,
      action: 'ATTENDANCE_MARKED',
      entityType: 'Attendance',
      entityId: attendanceDoc._id,
      metadata: {
        recordId: recordId,
        studentId: record.student,
        oldStatus: oldStatus,
        newStatus: status,
        note: note || `Marcado como ${status === 'P' ? 'Presente' : 'Falta'} por docente`,
        courseId: attendanceDoc.course,
        date: attendanceDoc.date
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Asistencia actualizada a ${status === 'P' ? 'Presente' : 'Falta'}`,
      data: {
        recordId: record._id,
        studentId: record.student,
        status: record.status,
        isLocked: record.lockedByRequest,
        note: record.note
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error en updateAttendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la asistencia',
      error: error.message
    });
  }
};

// EXTRA: Endpoint para director modificar licencias bloqueadas
// PATCH /api/attendance/unlock/:recordId
export const unlockAttendanceByDirector = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const { newStatus, justification } = req.body;
    const directorId = req.user.id;
    const directorRole = req.user.role;

    if (directorRole !== 'director') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Solo los directores de carrera pueden modificar licencias bloqueadas'
      });
    }

    if (!newStatus || !['P', 'F', 'L'].includes(newStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Use P, F o L'
      });
    }

    if (!justification || justification.trim().length < 10) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Se requiere una justificación de al menos 10 caracteres'
      });
    }

    // Buscar documento con el registro
    const attendanceDoc = await Attendance.findOne({
      'records._id': recordId
    }).session(session);

    if (!attendanceDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Registro de asistencia no encontrado'
      });
    }

    const record = attendanceDoc.records.id(recordId);
    if (!record) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    const oldStatus = record.status;
    const wasLocked = record.lockedByRequest;

    // Actualizar
    record.status = newStatus;
    record.lockedByRequest = newStatus === 'L' ? true : false;
    record.note = `MODIFICADO POR DIRECTOR: ${justification} | Anterior: ${record.note || ''}`;
    
    await attendanceDoc.save({ session });

    // Auditoría
    await AuditLog.create([{
      actor: directorId,
      action: 'ATTENDANCE_UNLOCKED_BY_DIRECTOR',
      entityType: 'Attendance',
      entityId: attendanceDoc._id,
      metadata: {
        recordId: recordId,
        studentId: record.student,
        oldStatus: oldStatus,
        newStatus: newStatus,
        wasLocked: wasLocked,
        justification: justification,
        courseId: attendanceDoc.course,
        date: attendanceDoc.date
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Asistencia modificada exitosamente por el director',
      data: {
        recordId: record._id,
        newStatus: record.status,
        isLocked: record.lockedByRequest
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error en unlockAttendanceByDirector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al modificar la asistencia',
      error: error.message
    });
  }
};