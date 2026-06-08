import { Request } from "../models/Request.js";
import { AuditLog } from "../models/AuditLog.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { ROLES } from "../constants/roles.js";

export const createRequest = async (req, res) => {
  try {
    const {
      reasonType,
      reasonDetail,
      dates,
      courseIds
    } = req.body;

    // Buscar un usuario de prueba
    const user = await User.findOne({
      role: ROLES.STUDENT
    });

    if (!user) {
      return res.status(404).json({
        message:
          "No existe un usuario estudiante para realizar pruebas"
      });
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        message: "Debe enviar al menos una fecha"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasPastDates = dates.some(
      (date) => new Date(date) < today
    );

    const mode = hasPastDates
      ? "justificacion_posterior"
      : "permiso_anticipado";

    const formattedDates = dates.map((date) => ({
      date
    }));

    const request = await Request.create({
      requester: user._id,
      requesterRole: user.role,
      requestType: "ausencia_estudiantil",
      mode,
      reasonType,
      reasonDetail,
      status: "pendiente",
      dates: formattedDates,
      courses: courseIds || []
    });

    await AuditLog.create({
      actor: user._id,
      action: "crear_solicitud",
      entityType: "Request",
      entityId: request._id,
      metadata: {
        requestId: request._id
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    const director = await User.findOne({
      role: ROLES.DIRECTOR
    });

    if (director) {
      await Notification.create({
        user: director._id,
        title: "Nueva solicitud",
        message:
          "Se registró una nueva solicitud pendiente de revisión",
        type: "solicitud",
        relatedRequest: request._id
      });
    }

    return res.status(201).json({
      success: true,
      message: "Solicitud creada correctamente",
      request
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error al crear la solicitud"
    });
  }
};
export const uploadRequestEvidence = async (
  req,
  res
) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(
      requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Debe enviar un archivo",
      });
    }

    request.evidence = {
      url:
        "/uploads/evidences/" +
        req.file.filename,

      localPath: req.file.path,

      originalName:
        req.file.originalname,
    };

    await request.save();

    res.json({
      success: true,
      message:
        "Evidencia subida correctamente",
      evidence: request.evidence,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Error al subir evidencia",
    });
  }
};