import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { ROLES } from "../src/constants/roles.js";
import {
  AuditLog,
  Attendance,
  Career,
  Course,
  Enrollment,
  Evidence,
  Notification,
  Request,
  Subject,
  User,
} from "../src/models/index.js";

const passwordHash = await bcrypt.hash("password123", 10);

function dateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function resetDemoData() {
  await Promise.all([
    AuditLog.deleteMany({}),
    Attendance.deleteMany({}),
    Evidence.deleteMany({}),
    Notification.deleteMany({}),
    Request.deleteMany({}),
    Enrollment.deleteMany({}),
    Course.deleteMany({}),
    Subject.deleteMany({}),
    Career.deleteMany({}),
    User.deleteMany({}),
  ]);
}

async function seedUsers() {
  const users = await User.insertMany([
    {
      firstName: "Administrador",
      lastName: "SIGEPEJ",
      email: "admin@sigepej.com",
      username: "admin",
      passwordHash,
      role: ROLES.ADMIN,
      code: "ADM-001",
    },
    {
      firstName: "Christian",
      lastName: "Montano",
      email: "director.sistemas@univalle.edu",
      username: "director_sistemas",
      passwordHash,
      role: ROLES.DIRECTOR,
      code: "DIR-SIS-001",
    },
    {
      firstName: "Secretaria",
      lastName: "Academica",
      email: "secretaria.sistemas@univalle.edu",
      username: "secretaria_sistemas",
      passwordHash,
      role: ROLES.SECRETARY,
      code: "SEC-SIS-001",
    },
    {
      firstName: "Ana",
      lastName: "Rojas",
      email: "ana.rojas@univalle.edu",
      username: "ana_rojas",
      passwordHash,
      role: ROLES.TEACHER,
      code: "DOC-001",
    },
    {
      firstName: "Carlos",
      lastName: "Mendez",
      email: "carlos.mendez@univalle.edu",
      username: "carlos_mendez",
      passwordHash,
      role: ROLES.TEACHER,
      code: "DOC-002",
    },
    {
      firstName: "Ricardo",
      lastName: "Nunez del Prado",
      email: "ricardo.nunez@univalle.edu",
      username: "ricardo_np",
      passwordHash,
      role: ROLES.STUDENT,
      code: "EST-2026-001",
    },
    {
      firstName: "Daniel",
      lastName: "Escobar Pozo",
      email: "daniel.escobar@univalle.edu",
      username: "daniel_escobar",
      passwordHash,
      role: ROLES.STUDENT,
      code: "EST-2026-002",
    },
    {
      firstName: "Josue",
      lastName: "Rodriguez Vera",
      email: "josue.rodriguez@univalle.edu",
      username: "josue_rodriguez",
      passwordHash,
      role: ROLES.STUDENT,
      code: "EST-2026-003",
    },
    {
      firstName: "Luis Fernando",
      lastName: "Lopez",
      email: "luis.lopez@univalle.edu",
      username: "luis_lopez",
      passwordHash,
      role: ROLES.STUDENT,
      code: "EST-2026-004",
    },
  ]);

  return Object.fromEntries(users.map((user) => [user.username, user]));
}

async function seedAcademicData(users) {
  const sistemas = await Career.create({
    code: "SIS",
    name: "Ingenieria de Sistemas",
    director: users.director_sistemas._id,
  });

  await User.updateMany(
    {
      username: {
        $in: [
          "director_sistemas",
          "secretaria_sistemas",
          "ricardo_np",
          "daniel_escobar",
          "josue_rodriguez",
          "luis_lopez",
        ],
      },
    },
    { $set: { career: sistemas._id } }
  );

  const subjects = await Subject.insertMany([
    { code: "WEB3", name: "Programacion Web III", career: sistemas._id, semester: 6 },
    { code: "BD2", name: "Base de Datos II", career: sistemas._id, semester: 5 },
    { code: "PROG3", name: "Programacion III", career: sistemas._id, semester: 4 },
  ]);

  const bySubjectCode = Object.fromEntries(subjects.map((subject) => [subject.code, subject]));

  const courses = await Course.insertMany([
    {
      code: "WEB3-G1-2026-1",
      subject: bySubjectCode.WEB3._id,
      career: sistemas._id,
      teacher: users.ana_rojas._id,
      parallel: "G1",
      period: "2026-1",
      schedule: [
        { day: "lunes", startTime: "08:00", endTime: "10:00", classroom: "Lab 3" },
        { day: "miercoles", startTime: "08:00", endTime: "10:00", classroom: "Lab 3" },
      ],
    },
    {
      code: "BD2-G1-2026-1",
      subject: bySubjectCode.BD2._id,
      career: sistemas._id,
      teacher: users.carlos_mendez._id,
      parallel: "G1",
      period: "2026-1",
      schedule: [{ day: "martes", startTime: "10:00", endTime: "12:00", classroom: "Aula 204" }],
    },
    {
      code: "PROG3-G2-2026-1",
      subject: bySubjectCode.PROG3._id,
      career: sistemas._id,
      teacher: users.ana_rojas._id,
      parallel: "G2",
      period: "2026-1",
      schedule: [{ day: "viernes", startTime: "14:00", endTime: "16:00", classroom: "Lab 1" }],
    },
  ]);

  const byCourseCode = Object.fromEntries(courses.map((course) => [course.code, course]));
  const students = [users.ricardo_np, users.daniel_escobar, users.josue_rodriguez, users.luis_lopez];

  await Enrollment.insertMany(
    courses.flatMap((course) =>
      students.map((student) => ({
        student: student._id,
        course: course._id,
        status: "inscrito",
      }))
    )
  );

  return { sistemas, subjects: bySubjectCode, courses: byCourseCode, students };
}

async function seedRequests(users, academic) {
  const studentRequest = await Request.create({
    requester: users.ricardo_np._id,
    requesterRole: ROLES.STUDENT,
    requestType: "ausencia_estudiantil",
    mode: "permiso_anticipado",
    reasonType: "academico",
    reasonDetail: "Participacion en actividad academica institucional.",
    status: "pendiente",
    dates: [{ date: dateOnly("2026-06-10"), course: academic.courses["WEB3-G1-2026-1"]._id }],
    courses: [academic.courses["WEB3-G1-2026-1"]._id],
    evidenceRequired: false,
    currentReviewer: users.director_sistemas._id,
  });

  const justificationRequest = await Request.create({
    requester: users.daniel_escobar._id,
    requesterRole: ROLES.STUDENT,
    requestType: "ausencia_estudiantil",
    mode: "justificacion_posterior",
    reasonType: "salud",
    reasonDetail: "Consulta medica por emergencia familiar.",
    status: "observado",
    dates: [{ date: dateOnly("2026-06-02"), course: academic.courses["WEB3-G1-2026-1"]._id }],
    courses: [academic.courses["WEB3-G1-2026-1"]._id],
    evidenceRequired: true,
    currentReviewer: users.director_sistemas._id,
    reviewer: users.director_sistemas._id,
    reviewedAt: new Date("2026-06-03T14:30:00.000Z"),
    reviewComment: "Adjuntar certificado medico legible.",
  });

  const teacherRequest = await Request.create({
    requester: users.ana_rojas._id,
    requesterRole: ROLES.TEACHER,
    requestType: "ausencia_docente",
    mode: "permiso_anticipado",
    reasonType: "academico",
    reasonDetail: "Capacitacion docente programada por la universidad.",
    status: "aprobado",
    dates: [
      { date: dateOnly("2026-06-12"), course: academic.courses["WEB3-G1-2026-1"]._id },
      { date: dateOnly("2026-06-12"), course: academic.courses["PROG3-G2-2026-1"]._id },
    ],
    courses: [academic.courses["WEB3-G1-2026-1"]._id, academic.courses["PROG3-G2-2026-1"]._id],
    evidenceRequired: false,
    currentReviewer: users.director_sistemas._id,
    reviewer: users.director_sistemas._id,
    reviewedAt: new Date("2026-06-03T15:00:00.000Z"),
    reviewComment: "Aprobado. Coordinar reemplazo o reposicion.",
  });

  await Evidence.create({
    request: justificationRequest._id,
    uploadedBy: users.daniel_escobar._id,
    fileName: "certificado-medico-demo.pdf",
    fileUrl: "http://localhost:5000/uploads/evidences/certificado-medico-demo.pdf",
    provider: "demo",
    mimeType: "application/pdf",
    size: 248000,
  });

  return { studentRequest, justificationRequest, teacherRequest };
}

async function seedAttendance(users, academic, requests) {
  await Attendance.create({
    course: academic.courses["WEB3-G1-2026-1"]._id,
    date: dateOnly("2026-06-02"),
    takenBy: users.ana_rojas._id,
    status: "cerrada",
    records: [
      { student: users.ricardo_np._id, status: "P" },
      {
        student: users.daniel_escobar._id,
        status: "F",
        request: requests.justificationRequest._id,
        note: "Pendiente de correccion de evidencia.",
      },
      { student: users.josue_rodriguez._id, status: "P" },
      { student: users.luis_lopez._id, status: "P" },
    ],
  });

  await Attendance.create({
    course: academic.courses["BD2-G1-2026-1"]._id,
    date: dateOnly("2026-06-03"),
    takenBy: users.carlos_mendez._id,
    status: "abierta",
    records: [
      { student: users.ricardo_np._id, status: "P" },
      { student: users.daniel_escobar._id, status: "P" },
      { student: users.josue_rodriguez._id, status: "F" },
      { student: users.luis_lopez._id, status: "P" },
    ],
  });
}

async function seedNotificationsAndAudit(users, requests) {
  await Notification.insertMany([
    {
      user: users.director_sistemas._id,
      title: "Nueva solicitud pendiente",
      message: "Ricardo Nunez del Prado envio un permiso anticipado.",
      type: "solicitud",
      relatedRequest: requests.studentRequest._id,
    },
    {
      user: users.daniel_escobar._id,
      title: "Solicitud observada",
      message: "Debe adjuntar certificado medico legible.",
      type: "revision",
      relatedRequest: requests.justificationRequest._id,
    },
    {
      user: users.ana_rojas._id,
      title: "Permiso docente aprobado",
      message: "Su ausencia docente para el 12/06/2026 fue aprobada.",
      type: "revision",
      relatedRequest: requests.teacherRequest._id,
      read: true,
      readAt: new Date("2026-06-03T16:00:00.000Z"),
    },
  ]);

  await AuditLog.insertMany([
    {
      actor: users.ricardo_np._id,
      action: "crear_solicitud",
      entityType: "Request",
      entityId: requests.studentRequest._id,
      metadata: { status: "pendiente", mode: "permiso_anticipado" },
    },
    {
      actor: users.director_sistemas._id,
      action: "observar_solicitud",
      entityType: "Request",
      entityId: requests.justificationRequest._id,
      metadata: { status: "observado", comment: "Adjuntar certificado medico legible." },
    },
    {
      actor: users.director_sistemas._id,
      action: "aprobar_solicitud",
      entityType: "Request",
      entityId: requests.teacherRequest._id,
      metadata: { status: "aprobado", requestType: "ausencia_docente" },
    },
  ]);
}

async function main() {
  await connectDatabase();
  await resetDemoData();

  const users = await seedUsers();
  const academic = await seedAcademicData(users);
  const requests = await seedRequests(users, academic);
  await seedAttendance(users, academic, requests);
  await seedNotificationsAndAudit(users, requests);

  await mongoose.connection.syncIndexes();

  const counts = {
    users: await User.countDocuments(),
    careers: await Career.countDocuments(),
    subjects: await Subject.countDocuments(),
    courses: await Course.countDocuments(),
    enrollments: await Enrollment.countDocuments(),
    requests: await Request.countDocuments(),
    evidences: await Evidence.countDocuments(),
    attendances: await Attendance.countDocuments(),
    notifications: await Notification.countDocuments(),
    auditLogs: await AuditLog.countDocuments(),
  };

  console.table(counts);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
