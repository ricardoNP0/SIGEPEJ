import { AuditLog } from "../models/AuditLog.js";

export async function getAuditLogs(req, res) {
  try {
    const logs = await AuditLog.find({})
      .populate("actor", "firstName lastName role code username")
      .sort({ createdAt: -1 });
    return res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return res.status(500).json({ message: "Error al obtener registros de auditoría" });
  }
}
