import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";
import { AuditLog } from "../models/AuditLog.js";
import { Course } from "../models/Course.js";
import { Notification } from "../models/Notification.js";
import { Request } from "../models/Request.js";
import { User } from "../models/User.js";

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
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("requester")
      .populate("courses")
      .populate("reviewer")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Error en getRequests:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener solicitudes",
      error: error.message
    });
  }
};
export const reviewRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewComment } = req.body;

    const allowedStatus = [
      "aprobado",
      "observado",
      "rechazado"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido"
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    request.status = status;
    request.reviewComment = reviewComment || "";
    request.reviewedAt = new Date();

    if (req.user) {
      request.reviewer = req.user._id;
    }

    await request.save();

    return res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error al revisar solicitud"
    });
  }
};