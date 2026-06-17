import { Request } from "../models/Request.js";
import { User } from "../models/User.js";
import { Attendance } from "../models/Attendance.js";

export async function getReportStats(req, res) {
  try {
    const totalUsers = await User.countDocuments({});
    
    // Solicitudes
    const pendingRequests = await Request.countDocuments({ status: "pendiente" });
    const approvedRequests = await Request.countDocuments({ status: { $in: ["aprobada", "aprobado"] } });
    const observedRequests = await Request.countDocuments({ status: { $in: ["observada", "observado"] } });
    const rejectedRequests = await Request.countDocuments({ status: { $in: ["rechazada", "rechazado"] } });
    const totalRequests = await Request.countDocuments({});

    // Clases / Asistencia
    const totalAttendances = await Attendance.countDocuments({});
    
    // Calcular porcentaje de asistencias presentes (P)
    const attendances = await Attendance.find({}).lean();
    let totalRecords = 0;
    let presentRecords = 0;
    let fallbackRecords = 0;
    let licenseRecords = 0;

    attendances.forEach(att => {
      if (att.records) {
        att.records.forEach(rec => {
          totalRecords++;
          if (rec.status === "P") presentRecords++;
          if (rec.status === "F") fallbackRecords++;
          if (rec.status === "L") licenseRecords++;
        });
      }
    });

    const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 100;

    return res.json({
      summary: {
        totalUsers,
        pendingRequests,
        approvedRequests,
        observedRequests,
        rejectedRequests,
        totalRequests,
        attendanceRate,
        licenseRecords
      },
      requestsByReason: [
        { name: "Salud", value: await Request.countDocuments({ reasonType: "salud" }) },
        { name: "Académico", value: await Request.countDocuments({ reasonType: "academico" }) },
        { name: "Personal", value: await Request.countDocuments({ reasonType: "personal" }) },
        { name: "Otros", value: await Request.countDocuments({ reasonType: "otros" }) },
      ]
    });
  } catch (error) {
    console.error("Error generating report stats:", error);
    return res.status(500).json({ message: "Error al generar reportes" });
  }
}
