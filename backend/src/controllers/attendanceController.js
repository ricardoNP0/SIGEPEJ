import mongoose from "mongoose";
import { Attendance } from "../models/Attendance.js";
import { AuditLog } from "../models/AuditLog.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import "../models/Subject.js";
import "../models/User.js";

function getStartAndEndOfDay(date) {
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

async function getOrCreateAttendance(courseId, date, userId) {
  const { start, end } = getStartAndEndOfDay(date);

  let attendance = await Attendance.findOne({
    course: courseId,
    date: { $gte: start, $lte: end },
  });

  if (!attendance) {
    const enrollments = await Enrollment.find({
      course: courseId,
      status: "inscrito",
    }).select("student");

    attendance = await Attendance.create({
      course: courseId,
      date: start,
      takenBy: userId,
      status: "abierta",
      records: enrollments.map((enrollment) => ({
        student: enrollment.student,
        status: "P",
        lockedByRequest: false,
      })),
    });
  }

  return attendance.populate("records.student", "firstName lastName email code");
}

function canManageCourse(user, course) {
  if (["director", "secretario", "administrador"].includes(user.role)) return true;
  return String(course.teacher) === String(user._id);
}

export const getAttendanceByCourseAndDate = async (req, res) => {
  try {
    const { courseId, date } = req.query;

    if (!courseId || !date) {
      return res.status(400).json({
        success: false,
        message: "Se requieren courseId y date como parametros de consulta",
      });
    }

    const course = await Course.findById(courseId).populate("subject", "name code");
    if (!course) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }

    if (!canManageCourse(req.user, course)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver la asistencia de este curso",
      });
    }

    const attendance = await getOrCreateAttendance(courseId, date, req.user._id);

    return res.json({
      success: true,
      data: {
        course: {
          id: course._id,
          code: course.code,
          subject: course.subject,
          parallel: course.parallel,
          period: course.period,
        },
        date: attendance.date,
        status: attendance.status,
        takenBy: attendance.takenBy,
        attendance: attendance.records.map((record) => ({
          recordId: record._id,
          studentId: record.student?._id || record.student,
          studentName: record.student?.firstName
            ? `${record.student.firstName} ${record.student.lastName}`
            : "Estudiante",
          studentEmail: record.student?.email,
          studentCode: record.student?.code,
          status: record.status,
          isLocked: record.lockedByRequest,
          request: record.request,
          note: record.note,
        })),
      },
    });
  } catch (error) {
    console.error("Error en getAttendanceByCourseAndDate:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener la asistencia",
      error: error.message,
    });
  }
};

export const updateAttendance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const { status, note } = req.body;

    if (!["P", "F"].includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Estado invalido. El docente solo puede usar P o F",
      });
    }

    const attendance = await Attendance.findOne({ "records._id": recordId }).session(session);
    if (!attendance) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registro no encontrado" });
    }

    const course = await Course.findById(attendance.course).session(session);
    if (!course || !canManageCourse(req.user, course)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para modificar esta asistencia",
      });
    }

    const record = attendance.records.id(recordId);
    if (!record) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registro no encontrado" });
    }

    if (record.lockedByRequest && record.status === "L") {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "No se puede modificar una licencia aprobada. Solo Direccion puede hacerlo con justificacion.",
      });
    }

    const oldStatus = record.status;
    record.status = status;
    record.note = note || record.note;
    attendance.takenBy = req.user._id;
    await attendance.save({ session });

    await AuditLog.create(
      [
        {
          actor: req.user._id,
          action: "marcar_asistencia",
          entityType: "Attendance",
          entityId: attendance._id,
          metadata: {
            recordId,
            studentId: record.student,
            oldStatus,
            newStatus: status,
            note,
            courseId: attendance.course,
            date: attendance.date,
          },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Asistencia actualizada correctamente",
      data: {
        recordId: record._id,
        studentId: record.student,
        status: record.status,
        isLocked: record.lockedByRequest,
        note: record.note,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updateAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la asistencia",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const unlockAttendanceByDirector = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const { newStatus, justification } = req.body;

    if (!["P", "F", "L"].includes(newStatus)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Use P, F o L" });
    }

    if (!justification || justification.trim().length < 10) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Se requiere una justificacion de al menos 10 caracteres",
      });
    }

    const attendance = await Attendance.findOne({ "records._id": recordId }).session(session);
    if (!attendance) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Registro no encontrado" });
    }

    const record = attendance.records.id(recordId);
    const oldStatus = record.status;
    const wasLocked = record.lockedByRequest;

    record.status = newStatus;
    record.lockedByRequest = newStatus === "L";
    record.note = `MODIFICADO POR DIRECCION: ${justification}`;
    attendance.takenBy = req.user._id;
    await attendance.save({ session });

    await AuditLog.create(
      [
        {
          actor: req.user._id,
          action: "modificar_licencia_por_direccion",
          entityType: "Attendance",
          entityId: attendance._id,
          metadata: {
            recordId,
            studentId: record.student,
            oldStatus,
            newStatus,
            wasLocked,
            justification,
            courseId: attendance.course,
            date: attendance.date,
          },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Asistencia modificada por Direccion",
      data: {
        recordId: record._id,
        status: record.status,
        isLocked: record.lockedByRequest,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en unlockAttendanceByDirector:", error);
    return res.status(500).json({
      success: false,
      message: "Error al modificar la asistencia",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
