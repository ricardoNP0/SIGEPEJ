import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";
import { AuditLog } from "../models/AuditLog.js";
import { Course } from "../models/Course.js";
import { Notification } from "../models/Notification.js";
import { Request } from "../models/Request.js";
import { User } from "../models/User.js";
import { applyStudentApproval, applyTeacherAbsence } from "../services/attendanceImpactService.js";

function parseJsonField(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeRole(value) {
  if (value === ROLES.TEACHER) return ROLES.TEACHER;
  return ROLES.STUDENT;
}

function inferMode(dates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasPastDate = dates.some((item) => {
    const dateValue = typeof item === "string" ? item : item.date;
    return new Date(dateValue) < today;
  });

  return hasPastDate ? "justificacion_posterior" : "permiso_anticipado";
}

async function getRequester(req, requesterRole) {
  if (req.user) return req.user;

  return User.findOne({ role: requesterRole }).sort({ createdAt: 1 });
}

async function resolveCourseIds(dates, rawCourses) {
  const courseCodes = new Set();
  const objectIds = new Set();

  for (const value of rawCourses) {
    if (!value) continue;
    if (mongoose.isValidObjectId(value)) objectIds.add(String(value));
    else courseCodes.add(String(value));
  }

  for (const item of dates) {
    const courseValue = item?.course || item?.courseId || item?.courseCode;
    if (!courseValue) continue;
    if (mongoose.isValidObjectId(courseValue)) objectIds.add(String(courseValue));
    else courseCodes.add(String(courseValue));
  }

  if (courseCodes.size > 0) {
    const courses = await Course.find({ code: { $in: Array.from(courseCodes) } }).select("_id");
    courses.forEach((course) => objectIds.add(String(course._id)));
  }

  return Array.from(objectIds);
}

function buildEvidence(file) {
  if (!file) return undefined;

  return {
    url: `/uploads/evidences/${file.filename}`,
    localPath: file.path,
    originalName: file.originalname,
  };
}

function normalizeStatus(value) {
  const map = {
    aprobada: "aprobado",
    aprobacion: "aprobado",
    aprobar: "aprobado",
    aprobado: "aprobado",
    observada: "observado",
    observar: "observado",
    observado: "observado",
    rechazada: "rechazado",
    rechazar: "rechazado",
    rechazado: "rechazado",
    apelada: "apelado",
    apelado: "apelado",
    pendiente: "pendiente",
  };

  return map[String(value || "").toLowerCase()] || value;
}

async function getActor(req, fallbackRole = ROLES.DIRECTOR) {
  if (req.user) return req.user;
  return User.findOne({ role: fallbackRole }).sort({ createdAt: 1 });
}

function requestPopulate(query) {
  return query
    .populate("requester", "firstName lastName username email role code")
    .populate({
      path: "dates.course",
      select: "code parallel period subject teacher",
      populate: [
        { path: "subject", select: "name code" },
        { path: "teacher", select: "firstName lastName username" },
      ],
    })
    .populate({
      path: "courses",
      select: "code parallel period subject teacher",
      populate: [
        { path: "subject", select: "name code" },
        { path: "teacher", select: "firstName lastName username" },
      ],
    })
    .populate("currentReviewer", "firstName lastName username role")
    .populate("reviewer", "firstName lastName username role");
}

function serializeRequest(request) {
  const raw = request.toObject ? request.toObject() : request;
  return {
    ...raw,
    id: raw._id,
    requesterName: raw.requester
      ? `${raw.requester.firstName || ""} ${raw.requester.lastName || ""}`.trim()
      : "",
    requesterUsername: raw.requester?.username,
    dates: (raw.dates || []).map((item) => ({
      ...item,
      courseId: item.course?._id || item.course,
      courseCode: item.course?.code,
      courseName: item.course?.subject?.name,
      parallel: item.course?.parallel,
    })),
    courses: (raw.courses || []).map((course) => ({
      id: course?._id || course,
      code: course?.code,
      subjectName: course?.subject?.name,
      parallel: course?.parallel,
    })),
    evidenceUrl: raw.evidence?.url,
    evidenceName: raw.evidence?.originalName,
  };
}

async function notifyRequestOwner(request, title, message, session) {
  if (!request.requester) return;

  await Notification.create(
    [
      {
        user: request.requester,
        title,
        message,
        type: "revision",
        relatedRequest: request._id,
      },
    ],
    { session }
  );
}

export const listRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== "todos") {
      filter.status = normalizeStatus(status);
    }

    const requests = await requestPopulate(
      Request.find(filter).sort({ createdAt: -1 })
    );

    return res.json({
      success: true,
      requests: requests.map(serializeRequest),
    });
  } catch (error) {
    console.error("Error en listRequests:", error);
    return res.status(500).json({
      success: false,
      message: "Error al listar solicitudes",
      error: error.message,
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requester = req.user || (await getRequester(req, normalizeRole(req.query.role)));

    if (!requester) {
      return res.json([]);
    }

    const requests = await requestPopulate(
      Request.find({ requester: requester._id }).sort({ createdAt: -1 })
    );

    return res.json(requests.map(serializeRequest));
  } catch (error) {
    console.error("Error en getMyRequests:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener historial",
      error: error.message,
    });
  }
};

export const createRequest = async (req, res) => {
  try {
    const requesterRole = normalizeRole(req.body.requesterRole || req.user?.role);
    const requester = await getRequester(req, requesterRole);

    if (!requester) {
      return res.status(404).json({
        success: false,
        message: "No existe un usuario demo para crear la solicitud",
      });
    }

    const rawDates = parseJsonField(req.body.dates);
    if (!Array.isArray(rawDates) || rawDates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe enviar al menos una fecha",
      });
    }

    const rawCourses = parseJsonField(req.body.courseIds, parseJsonField(req.body.courses));
    const courseIds = await resolveCourseIds(rawDates, rawCourses);
    const formattedDates = [];

    for (const item of rawDates) {
      const dateValue = typeof item === "string" ? item : item.date;
      const courseValue = item?.course || item?.courseId || item?.courseCode;
      let courseId = mongoose.isValidObjectId(courseValue) ? courseValue : undefined;

      if (!courseId && courseValue) {
        const course = await Course.findOne({ code: courseValue }).select("_id");
        courseId = course?._id;
      }

      formattedDates.push({
        date: new Date(dateValue),
        ...(courseId ? { course: courseId } : {}),
      });
    }

    const director = await User.findOne({ role: ROLES.DIRECTOR });
    const evidence = buildEvidence(req.file);
    const reasonType = req.body.reasonType || "otro";

    const request = await Request.create({
      requester: requester._id,
      requesterRole,
      requestType:
        req.body.requestType ||
        (requesterRole === ROLES.TEACHER ? "ausencia_docente" : "ausencia_estudiantil"),
      mode: req.body.mode || inferMode(rawDates),
      reasonType,
      reasonDetail: req.body.reasonDetail || "Solicitud registrada desde frontend",
      status: "pendiente",
      dates: formattedDates,
      courses: courseIds,
      evidenceRequired: reasonType === "salud",
      ...(evidence ? { evidence } : {}),
      currentReviewer: director?._id,
    });

    await AuditLog.create({
      actor: requester._id,
      action: "crear_solicitud",
      entityType: "Request",
      entityId: request._id,
      metadata: { requestId: request._id, requesterRole, courseIds },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (director) {
      await Notification.create({
        user: director._id,
        title: "Nueva solicitud",
        message: "Se registro una nueva solicitud pendiente de revision",
        type: "solicitud",
        relatedRequest: request._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Solicitud creada correctamente",
      request,
    });
  } catch (error) {
    console.error("Error en createRequest:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear la solicitud",
      error: error.message,
    });
  }
};

export const uploadRequestEvidence = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Debe enviar un archivo" });
    }

    request.evidence = buildEvidence(req.file);
    await request.save();

    return res.json({
      success: true,
      message: "Evidencia subida correctamente",
      evidence: request.evidence,
    });
  } catch (error) {
    console.error("Error en uploadRequestEvidence:", error);

    return res.status(500).json({
      success: false,
      message: "Error al subir evidencia",
      error: error.message,
    });
  }
};

export const reviewRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const nextStatus = normalizeStatus(req.body.status || req.body.action);
    const reviewComment = (req.body.reviewComment || req.body.comment || "").trim();

    if (!["aprobado", "observado", "rechazado"].includes(nextStatus)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Estado de revisión inválido",
      });
    }

    if ((nextStatus === "observado" || nextStatus === "rechazado") && reviewComment.length < 5) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Debe registrar un comentario claro para observar o rechazar",
      });
    }

    const actor = await getActor(req, ROLES.DIRECTOR);
    if (!actor) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No existe usuario responsable para revisar",
      });
    }

    const request = await Request.findById(requestId).session(session);
    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada",
      });
    }

    const previousStatus = request.status;
    request.status = nextStatus;
    request.reviewer = actor._id;
    request.currentReviewer = actor._id;
    request.reviewedAt = new Date();
    request.reviewComment = reviewComment;
    await request.save({ session });

    let impact = null;
    if (nextStatus === "aprobado") {
      if (request.requestType === "ausencia_estudiantil") {
        impact = await applyStudentApproval(request, session);
      } else if (request.requestType === "ausencia_docente") {
        impact = await applyTeacherAbsence(request, session);
      }
    } else {
      await notifyRequestOwner(
        request,
        nextStatus === "observado" ? "Solicitud observada" : "Solicitud rechazada",
        reviewComment || `Tu solicitud fue marcada como ${nextStatus}.`,
        session
      );
    }

    await AuditLog.create(
      [
        {
          actor: actor._id,
          action: `${nextStatus}_solicitud`,
          entityType: "Request",
          entityId: request._id,
          metadata: {
            previousStatus,
            nextStatus,
            reviewComment,
            impact,
          },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const populated = await requestPopulate(Request.findById(request._id));
    return res.json({
      success: true,
      message: "Solicitud revisada correctamente",
      request: serializeRequest(populated),
      impact,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en reviewRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Error al revisar solicitud",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const updateObservedRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
    }

    if (request.status !== "observado") {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "Solo se pueden corregir solicitudes observadas",
      });
    }

    const rawDates = parseJsonField(req.body.dates, request.dates);
    const rawCourses = parseJsonField(req.body.courseIds, parseJsonField(req.body.courses, request.courses));
    const courseIds = await resolveCourseIds(rawDates, rawCourses);
    const formattedDates = [];

    for (const item of rawDates) {
      const dateValue = typeof item === "string" ? item : item.date;
      const courseValue = item?.course || item?.courseId || item?.courseCode;
      let courseId = mongoose.isValidObjectId(courseValue) ? courseValue : undefined;

      if (!courseId && courseValue) {
        const course = await Course.findOne({ code: courseValue }).select("_id").session(session);
        courseId = course?._id;
      }

      formattedDates.push({
        date: new Date(dateValue),
        ...(courseId ? { course: courseId } : {}),
      });
    }

    const requester = await User.findById(request.requester).session(session);
    const director = await User.findOne({ role: ROLES.DIRECTOR }).session(session);
    const evidence = buildEvidence(req.file);

    request.reasonType = req.body.reasonType || request.reasonType;
    request.reasonDetail = req.body.reasonDetail || request.reasonDetail;
    request.mode = req.body.mode || inferMode(formattedDates);
    request.dates = formattedDates.length > 0 ? formattedDates : request.dates;
    request.courses = courseIds.length > 0 ? courseIds : request.courses;
    request.status = "pendiente";
    request.reviewComment = "";
    request.currentReviewer = director?._id || request.currentReviewer;
    request.correctedAt = new Date();
    if (evidence) request.evidence = evidence;
    await request.save({ session });

    await AuditLog.create(
      [
        {
          actor: requester?._id || request.requester,
          action: "corregir_solicitud_observada",
          entityType: "Request",
          entityId: request._id,
          metadata: { nextStatus: "pendiente", courseIds },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      ],
      { session }
    );

    if (director) {
      await Notification.create(
        [
          {
            user: director._id,
            title: "Solicitud corregida",
            message: "Una solicitud observada fue corregida y vuelve a revisión.",
            type: "solicitud",
            relatedRequest: request._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    const populated = await requestPopulate(Request.findById(request._id));
    return res.json({
      success: true,
      message: "Solicitud corregida y reenviada a revisión",
      request: serializeRequest(populated),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updateObservedRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Error al corregir solicitud",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const appealRejectedRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const appealComment = (req.body.justification || req.body.appealComment || "").trim();

    if (appealComment.length < 10) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "La apelación debe tener al menos 10 caracteres",
      });
    }

    const request = await Request.findById(requestId).session(session);
    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
    }

    if (request.status !== "rechazado") {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "Solo se pueden apelar solicitudes rechazadas",
      });
    }

    const director = await User.findOne({ role: ROLES.DIRECTOR }).session(session);
    const requester = await User.findById(request.requester).session(session);
    request.status = "apelado";
    request.appealComment = appealComment;
    request.currentReviewer = director?._id || request.currentReviewer;
    await request.save({ session });

    await AuditLog.create(
      [
        {
          actor: requester?._id || request.requester,
          action: "apelar_solicitud_rechazada",
          entityType: "Request",
          entityId: request._id,
          metadata: { appealComment, nextStatus: "apelado" },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      ],
      { session }
    );

    if (director) {
      await Notification.create(
        [
          {
            user: director._id,
            title: "Solicitud apelada",
            message: "Una solicitud rechazada fue apelada y requiere nueva revisión.",
            type: "solicitud",
            relatedRequest: request._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    const populated = await requestPopulate(Request.findById(request._id));
    return res.json({
      success: true,
      message: "Apelación enviada correctamente",
      request: serializeRequest(populated),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en appealRejectedRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Error al apelar solicitud",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
