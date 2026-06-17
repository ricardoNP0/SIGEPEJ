import { Attendance } from "../models/Attendance.js";
import { Course } from "../models/Course.js";
import { Request } from "../models/Request.js";
import { User } from "../models/User.js";

function normalizeStatus(value) {
  const map = {
    aprobada: "aprobado",
    aprobado: "aprobado",
    observada: "observado",
    observado: "observado",
    rechazada: "rechazado",
    rechazado: "rechazado",
    apelada: "apelado",
    apelado: "apelado",
    pendiente: "pendiente",
  };

  return map[String(value || "").toLowerCase()] || value;
}

async function buildRequestFilter(query) {
  const filter = {};
  const courseFilter = {};

  if (query.status) {
    filter.status = normalizeStatus(query.status);
  }

  if (query.startDate || query.endDate) {
    filter["dates.date"] = {};
    if (query.startDate) filter["dates.date"].$gte = new Date(`${query.startDate}T00:00:00.000Z`);
    if (query.endDate) filter["dates.date"].$lte = new Date(`${query.endDate}T23:59:59.999Z`);
  }

  if (query.career) courseFilter.career = query.career;
  if (query.subject) courseFilter.subject = query.subject;

  if (Object.keys(courseFilter).length > 0) {
    const courses = await Course.find(courseFilter).select("_id");
    filter.courses = { $in: courses.map((course) => course._id) };
  }

  return filter;
}

export async function getReportStats(req, res) {
  try {
    const requestFilter = await buildRequestFilter(req.query);
    const totalUsers = await User.countDocuments({});

    const pendingRequests = await Request.countDocuments({ ...requestFilter, status: "pendiente" });
    const approvedRequests = await Request.countDocuments({ ...requestFilter, status: "aprobado" });
    const observedRequests = await Request.countDocuments({ ...requestFilter, status: "observado" });
    const rejectedRequests = await Request.countDocuments({ ...requestFilter, status: "rechazado" });
    const totalRequests = await Request.countDocuments(requestFilter);

    const attendances = await Attendance.find({}).lean();
    let totalRecords = 0;
    let presentRecords = 0;
    let licenseRecords = 0;

    attendances.forEach((attendance) => {
      attendance.records?.forEach((record) => {
        totalRecords += 1;
        if (record.status === "P") presentRecords += 1;
        if (record.status === "L") licenseRecords += 1;
      });
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
        licenseRecords,
      },
      requestsByReason: [
        { name: "Salud", value: await Request.countDocuments({ ...requestFilter, reasonType: "salud" }) },
        { name: "Académico", value: await Request.countDocuments({ ...requestFilter, reasonType: "academico" }) },
        { name: "Personal", value: await Request.countDocuments({ ...requestFilter, reasonType: "personal" }) },
        {
          name: "Otros",
          value: await Request.countDocuments({
            ...requestFilter,
            reasonType: { $in: ["otro", "emergencia", "fuerza_mayor"] },
          }),
        },
      ],
    });
  } catch (error) {
    console.error("Error generating report stats:", error);
    return res.status(500).json({ message: "Error al generar reportes" });
  }
}
