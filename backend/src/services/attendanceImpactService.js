import { Attendance } from "../models/Attendance.js";
import { AuditLog } from "../models/AuditLog.js";
import { Enrollment } from "../models/Enrollment.js";
import { Notification } from "../models/Notification.js";

function dayRange(date) {
  const base =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00.000Z`)
      : new Date(date);
  const start = new Date(base);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
}

async function getOrCreateAttendanceDocument(courseId, date, session, takenBy) {
  const { start, end } = dayRange(date);

  let attendance = await Attendance.findOne({
    course: courseId,
    date: { $gte: start, $lte: end },
  }).session(session);

  if (!attendance) {
    attendance = new Attendance({
      course: courseId,
      date: start,
      takenBy,
      status: "abierta",
      records: [],
    });
  } else if (takenBy && !attendance.takenBy) {
    attendance.takenBy = takenBy;
  }

  await attendance.save({ session });
  return attendance;
}

async function updateOrCreateRecord({
  attendance,
  studentId,
  status,
  requestId,
  reviewedBy,
  note,
  session,
}) {
  let record = attendance.records.find(
    (item) => String(item.student) === String(studentId)
  );

  const oldStatus = record?.status || null;
  const wasLocked = Boolean(record?.lockedByRequest);

  if (record?.lockedByRequest && record.status === "L" && status !== "L") {
    return { modified: false, reason: "student_license_locked" };
  }

  if (!record) {
    attendance.records.push({
      student: studentId,
      status,
      lockedByRequest: true,
      request: requestId,
      note,
    });
    record = attendance.records[attendance.records.length - 1];
  } else {
    record.status = status;
    record.lockedByRequest = true;
    record.request = requestId;
    record.note = note;
  }

  attendance.takenBy = reviewedBy;
  await attendance.save({ session });

  return { modified: true, record, oldStatus, wasLocked };
}

export async function applyStudentApproval(request, session) {
  const requestId = request._id;
  const studentId = request.requester;
  const reviewedBy = request.reviewer || request.currentReviewer;
  let modifiedCount = 0;

  for (const item of request.dates || []) {
    if (!item.course) continue;

    const attendance = await getOrCreateAttendanceDocument(
      item.course,
      item.date,
      session,
      reviewedBy
    );

    const result = await updateOrCreateRecord({
      attendance,
      studentId,
      status: "L",
      requestId,
      reviewedBy,
      note: `Licencia aprobada mediante solicitud ${requestId}`,
      session,
    });

    if (!result.modified) continue;
    modifiedCount++;

    await AuditLog.create(
      [
        {
          actor: reviewedBy,
          action: "asistencia_actualizada_por_solicitud_estudiantil",
          entityType: "Attendance",
          entityId: attendance._id,
          metadata: {
            requestId,
            studentId,
            recordId: result.record._id,
            oldStatus: result.oldStatus,
            newStatus: "L",
            wasLocked: result.wasLocked,
            courseId: item.course,
            date: item.date,
          },
        },
      ],
      { session }
    );
  }

  await Notification.create(
    [
      {
        user: studentId,
        title: "Solicitud aprobada",
        message: "Tu solicitud fue aprobada y la asistencia quedo marcada como L.",
        type: "asistencia",
        relatedRequest: requestId,
      },
    ],
    { session }
  );

  return { success: true, modifiedCount };
}

export async function applyTeacherAbsence(request, session) {
  const requestId = request._id;
  const teacherId = request.requester;
  const reviewedBy = request.reviewer || request.currentReviewer;
  let modifiedCount = 0;
  const affectedStudents = new Set();

  for (const item of request.dates || []) {
    if (!item.course) continue;

    const enrollments = await Enrollment.find({
      course: item.course,
      status: "inscrito",
    })
      .select("student")
      .session(session);

    const attendance = await getOrCreateAttendanceDocument(
      item.course,
      item.date,
      session,
      reviewedBy
    );

    for (const enrollment of enrollments) {
      const result = await updateOrCreateRecord({
        attendance,
        studentId: enrollment.student,
        status: "P",
        requestId,
        reviewedBy,
        note: `Presente automatico por ausencia docente aprobada ${requestId}`,
        session,
      });

      if (!result.modified) continue;
      modifiedCount++;
      affectedStudents.add(String(enrollment.student));

      await AuditLog.create(
        [
          {
            actor: reviewedBy,
            action: "asistencia_actualizada_por_ausencia_docente",
            entityType: "Attendance",
            entityId: attendance._id,
            metadata: {
              requestId,
              teacherId,
              studentId: enrollment.student,
              recordId: result.record._id,
              courseId: item.course,
              date: item.date,
            },
          },
        ],
        { session }
      );
    }
  }

  if (affectedStudents.size > 0) {
    await Notification.create(
      Array.from(affectedStudents).map((studentId) => ({
        user: studentId,
        title: "Clase con ausencia docente aprobada",
        message: "La ausencia docente fue aprobada y tu asistencia quedo como P.",
        type: "asistencia",
        relatedRequest: requestId,
      })),
      { session }
    );
  }

  return { success: true, modifiedCount };
}
