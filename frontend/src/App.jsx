import { Navigate, Route, Routes, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  UsersRound,
  AlertCircle,
  CheckSquare,
  XSquare,
  BookOpen,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import ResetRequestsPage from "./features/auth/ResetRequestsPage.jsx";
import AttendancePage from "./features/attendance/AttendancePage.jsx";
import RevisionPage from "./features/requests/RevisionPage.jsx";
import StudentRequestForm from "./features/requests/StudentRequestForm.jsx";
import TeacherRequestForm from "./features/requests/TeacherRequestForm.jsx";
import RequestHistoryPage from "./features/requests/RequestHistoryPage.jsx";
import NotificationsPage from "./features/notifications/NotificationsPage.jsx";
import UsersPage from "./features/users/UsersPage.jsx";
import CatalogsPage from "./features/catalogs/CatalogsPage.jsx";
import ReportsPage from "./features/reports/ReportsPage.jsx";
import AuditPage from "./features/audit/AuditPage.jsx";
import { apiClient } from "./api/client.js";

// Datos globales (Admin, Director de Carrera, Secretario Académico)
const globalStats = [
  { label: "Solicitudes pendientes", value: "18", detail: "Requieren revision", icon: Clock3 },
  { label: "Aprobadas esta semana", value: "34", detail: "Con registro de auditoria", icon: CheckCircle2 },
  { label: "Licencia", value: "9", detail: "Registrados en el sistemcomo L", icon: ShieldCheck },
  { label: "Usuarios", value: "9", detail: "Registrados en el sistema", icon: UsersRound },
];



// Datos personalizados para Estudiante
const studentStats = [
  { label: "Mis solicitudes enviadas", value: "5", detail: "En revisión y aprobadas", icon: FileText },
  { label: "Permisos aprobados", value: "3", detail: "Disponibles para usar", icon: CheckCircle2 },
  { label: "Faltas justificadas", value: "2", detail: "Con permiso autorizado", icon: ShieldCheck },
  { label: "Faltas por justificar", value: "1", detail: "Requiere trámite", icon: AlertCircle },
];

const studentRequests = [
  { code: "SOL-2026-A01", subject: "Cálculo I", type: "Permiso anticipado", status: "aprobada", date: "2026-06-10" },
  { code: "SOL-2026-A02", subject: "Programación Web", type: "Justificacion posterior", status: "pendiente", date: "2026-06-08" },
  { code: "SOL-2026-A03", subject: "Algebra Lineal", type: "Ausencia estudiante", status: "aprobada", date: "2026-06-05" },
];

// Datos personalizados para Docente
const teacherStats = [
  { label: "Mis licencias solicitadas", value: "2", detail: "Permisos pendientes", icon: Briefcase },
  { label: "Clases con suplencia", value: "4", detail: "Programadas este mes", icon: BookOpen },
  { label: "Porcentaje de asistencia", value: "94%", detail: "Mes actual", icon: CheckSquare },
];

const teacherRequests = [
  { code: "SOL-2026-D01", type: "Licencia sanitaria", status: "pendiente", date: "2026-06-12" },
  { code: "SOL-2026-D02", type: "Permiso administrativo", status: "aprobada", date: "2026-06-05" },
  { code: "SOL-2026-D03", type: "Licencia por duelo", status: "aprobada", date: "2026-06-01" },
];

const pageDetails = {
  "/reportes": {
    title: "Reportes",
    eyebrow: "Analitica",
    description: "Reportes por carrera, materia, estado, docente, estudiante y periodo academico.",
    actions: ["Filtrar", "Exportar", "Ver indicadores"],
  },
  "/catalogos": {
    title: "Catalogos academicos",
    eyebrow: "Base institucional",
    description: "Pantallas placeholder para carreras, materias, cursos, paralelos, docentes e inscripciones simuladas.",
    actions: ["Carreras", "Materias", "Inscripciones"],
  },
  "/usuarios": {
    title: "Usuarios y roles",
    eyebrow: "Administrador",
    description: "Administracion visual de estudiantes, docentes, directores, secretarios y permisos de acceso.",
    actions: ["Crear usuario", "Asignar rol", "Bloquear acceso"],
  },
  "/auditoria": {
    title: "Auditoria",
    eyebrow: "Trazabilidad",
    description: "Historial de aprobaciones, cambios de estado, fecha, hora, usuario responsable y motivo de cada accion critica.",
    actions: ["Ver evento", "Filtrar usuario", "Revisar cambios"],
  },
};

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para datos dinámicos
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [attendanceF, setAttendanceF] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el rol actual y normalizarlo
  const userRole = user?.role?.toLowerCase() || "estudiante";

  // Formatear fecha: solo fecha si es YYYY-MM-DD, fecha+hora si tiene time
  const fmtDate = (val) => {
    if (!val) return "-";
    const s = String(val);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.split("-").reverse().join("/");
    const d = new Date(s);
    if (isNaN(d.getTime())) return s.slice(0, 10);
    return d.toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Normalizar estado para clases CSS (acepta femenino y masculino)
  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "aprobada" || s === "aprobado" || s === "aprobado_admin") return "aprobada";
    if (s === "rechazada" || s === "rechazado") return "rechazada";
    if (s === "observada" || s === "observado") return "observada";
    return "pendiente";
  };

  // Determinar si mostrar datos globales o personalizados
  const isGlobalRole = ["administrador", "director_carrera", "director de carrera", "secretario_academico", "secretario academico"].includes(userRole);
  const isStudent = userRole === "estudiante";
  const isTeacher = userRole === "docente";

  const pageTitle = isStudent ? "Mi panel de solicitudes" : isTeacher ? "Mi panel docente" : "Panel SIGEPEJ";
  const pageDescription = isStudent 
    ? "Consulta el estado de tus solicitudes, permisos y faltas justificadas."
    : isTeacher
    ? "Gestiona tus permisos, suplencias y registra tu asistencia."
    : "Base visual para que el equipo conecte solicitudes, asistencia, notificaciones, auditoria y reportes sin rehacer la navegacion.";

  // Cargar datos dinámicamente
  async function loadDashboardData() {
    setLoading(true);
    try {
      if (isStudent) {
        // Obtener solicitudes del estudiante
        const userRequests = await apiClient.getMyRequests(user);
        // Obtener faltas marcadas por el docente en asistencia
        let attendanceAbsences = [];
        try {
          attendanceAbsences = await apiClient.getStudentAbsences(user.code) || [];
        } catch (_) { /* ignore */ }

        setRequests(userRequests);
        setAttendanceF(attendanceAbsences);

        // Calcular estadísticas dinámicamente (contando fechas, no solicitudes)
        const sentCount = userRequests.length;
        const approved = ["aprobada", "aprobado", "aprobado_admin"];
        const pending = ["pendiente", "observada", "observado"];
        const approvedPermits = userRequests
          .filter(r => approved.includes(r.status) && r.mode === "permiso_anticipado")
          .reduce((sum, r) => sum + (r.dates?.length || 0), 0);
        const justifiedAbsences = userRequests
          .filter(r => approved.includes(r.status) && r.mode === "justificacion_posterior")
          .reduce((sum, r) => sum + (r.dates?.length || 0), 0) + attendanceAbsences.length;
        const pendingAbsences = userRequests
          .filter(r => pending.includes(r.status))
          .reduce((sum, r) => sum + (r.dates?.length || 0), 0);

        setStats([
          { label: "Mis solicitudes enviadas", value: String(sentCount), detail: "En revisión y aprobadas", icon: FileText },
          { label: "Permisos aprobados", value: String(approvedPermits), detail: "Disponibles para usar", icon: CheckCircle2 },
          { label: "Faltas justificadas", value: String(justifiedAbsences), detail: "Con permiso autorizado", icon: ShieldCheck },
          { label: "Faltas por justificar", value: String(pendingAbsences), detail: "Requiere trámite", icon: AlertCircle },
        ]);
      } else if (isTeacher) {
        const userRequests = await apiClient.getMyRequests(user);
        setRequests(userRequests);

        const requestedLicenses = userRequests.length;
        const classesWithSubstitution = userRequests.filter(r => r.status === "aprobada").length;

        setStats([
          { label: "Mis licencias solicitadas", value: String(requestedLicenses), detail: "Permisos pendientes", icon: Briefcase },
          { label: "Clases con suplencia", value: String(classesWithSubstitution), detail: "Programadas este mes", icon: BookOpen },
          { label: "Porcentaje de asistencia", value: "94%", detail: "Mes actual", icon: CheckSquare },
        ]);
      } else {
        // Para roles globales, cargar solicitudes dinámicamente
        const allRequests = await apiClient.getAllRequests("todos");
        const sorted = (allRequests || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setRequests(sorted.slice(0, 3));
        setStats(globalStats);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback a datos estáticos
      if (isStudent) {
        setStats([
          { label: "Mis solicitudes enviadas", value: "0", detail: "En revisión y aprobadas", icon: FileText },
          { label: "Permisos aprobados", value: "0", detail: "Disponibles para usar", icon: CheckCircle2 },
          { label: "Faltas justificadas", value: "0", detail: "Con permiso autorizado", icon: ShieldCheck },
          { label: "Faltas por justificar", value: "0", detail: "Requiere trámite", icon: AlertCircle },
        ]);
        setRequests([]);
      } else if (isTeacher) {
        setStats([
          { label: "Mis licencias solicitadas", value: "0", detail: "Permisos pendientes", icon: Briefcase },
          { label: "Clases con suplencia", value: "0", detail: "Programadas este mes", icon: BookOpen },
          { label: "Porcentaje de asistencia", value: "0%", detail: "Mes actual", icon: CheckSquare },
        ]);
        setRequests([]);
      } else {
        setStats(globalStats);
        setRequests([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.username) {
      loadDashboardData();
    }
  }, [user, isStudent, isTeacher, location.key]);

  // Extraer todas las fechas de ausencia (desde requests + asistencia)
  const absences = useMemo(() => {
    if (!isStudent) return [];
    const result = [];

    // Desde solicitudes
    requests.forEach(req => {
      const justified = req.status === "aprobada" || req.status === "aprobado" || req.status === "aprobado_admin";
      (req.dates || []).forEach(d => {
        result.push({
          date: d.date?.slice(0, 10) || d,
          course: d.courseName || "Materia",
          code: d.courseCode || "",
          justified,
          requestCode: req.code
        });
      });
    });

    // Desde asistencia (F marcado por docente)
    attendanceF.forEach(a => {
      result.push({
        date: a.date?.slice(0, 10) || a.date,
        course: a.course,
        code: a.courseCode || "",
        justified: false,
        requestCode: ""
      });
    });

    // Sort by date descending
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    return result;
  }, [requests, attendanceF, isStudent]);

  // Seleccionar datos según rol
  const displayStats = stats.length > 0 ? stats : (isStudent ? [] : isTeacher ? [] : globalStats);
  const displayRequests = requests;

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">{isGlobalRole ? "Resumen general" : isStudent ? "Tu gestión" : "Gestión docente"}</span>
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
        <button className="btn-secondary compact-button" type="button" onClick={loadDashboardData} style={{ alignSelf: "flex-start", display: "inline-flex", gap: "6px" }}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="stat-grid">
        {displayStats.map((item) => {
          const Icon = item.icon;
          return (
            <article className="stat-card" key={item.label}>
              <div className="icon-box">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <section className="surface-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Actividad</span>
              <h2>
                {isGlobalRole
                  ? "Solicitudes recientes"
                  : isStudent
                  ? "Mis solicitudes"
                  : "Mis licencias y avisos"}
              </h2>
            </div>
          </div>

          <div className="table-like" role="table" aria-label="Solicitudes recientes">
            {displayRequests && displayRequests.length > 0 ? (
              displayRequests.map((request) => (
                <div className="table-row" role="row" key={request.code || request.id}>
                  <div>
                    <strong>{request.code || request.id}</strong>
                    <span>
                      {isGlobalRole
                        ? request.owner || request.requesterName
                        : isStudent
                        ? request.subject || (request.dates && request.dates[0]?.courseName)
                        : request.type || request.requestType}
                    </span>
                  </div>
                  <div>
                    <span>
                      {isGlobalRole
                        ? request.type || request.requestType
                        : isStudent
                        ? request.type || request.requestType
                        : "Permiso"}
                    </span>
                    <small>{fmtDate(request.date || request.createdAt)}</small>
                  </div>
                  <span className={`status-pill ${statusClass(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="table-row">
                <div>
                  <span>No hay solicitudes para mostrar</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {isStudent && (
          <section className="surface-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Control</span>
                <h2>Fechas de faltas</h2>
              </div>
            </div>
            <div className="table-like" role="table" aria-label="Fechas de faltas">
              {absences.length > 0 ? (
                absences.map((a, i) => (
                  <div className="table-row" role="row" key={`${a.date}-${a.code}-${i}`}>
                    <div>
                      <strong>{fmtDate(a.date)}</strong>
                      <span>{a.course}</span>
                    </div>
                    <span className={`status-pill ${a.justified ? "aprobada" : "pendiente"}`}>
                      {a.justified ? "Justificado" : "Sin justificar"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="table-row">
                  <div>
                    <span>No hay faltas registradas</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

function PlaceholderPage({ details }) {
  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">{details.eyebrow}</span>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
      </div>

      <div className="placeholder-layout">
        <section className="surface-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Pendiente de desarrollo</span>
              <h2>Estructura inicial</h2>
            </div>
            <FileText size={22} className="muted-icon" aria-hidden="true" />
          </div>
          <p className="panel-copy">
            Esta pantalla ya esta enrutada y lista para que el responsable de la
            tarea agregue formularios, tablas, consumo de API y validaciones.
          </p>
          <div className="action-list">
            {details.actions.map((action) => (
              <button className="secondary-action" type="button" key={action}>
                {action}
              </button>
            ))}
          </div>
        </section>

        <aside className="surface-panel guidance-panel">
          <Bell size={22} className="muted-icon" aria-hidden="true" />
          <h2>Regla de integracion</h2>
          <p>
            No duplicar sidebar ni topbar. Cada modulo debe trabajar dentro de
            esta zona de contenido para mantener consistencia entre roles.
          </p>
        </aside>
      </div>
    </section>
  );
}

function GitHubPagesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const stored = sessionStorage.getItem("redirect");
    if (stored) {
      sessionStorage.removeItem("redirect");
      navigate(stored, { replace: true });
    }
  }, [navigate]);
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* SPA redirect handler for GitHub Pages */}
        <Route element={<GitHubPagesRedirect />}>
          {/* Pantalla de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas dentro del layout */}
          <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Sprint 1: Rutas implementadas */}
          <Route path="nueva-solicitud" element={<StudentRequestForm />} />
          <Route path="solicitud-docente" element={<TeacherRequestForm />} />
          <Route path="mis-solicitudes" element={<RequestHistoryPage />} />
          <Route path="revision" element={<RevisionPage />} />
          <Route path="asistencia" element={<AttendancePage />} />
          <Route path="historial" element={<Navigate to="/mis-solicitudes" replace />} />
          <Route path="notificaciones" element={<NotificationsPage />} />

          {/* Rutas de Administrador */}
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="restablecer-contrasena" element={<ResetRequestsPage />} />
          <Route path="catalogos" element={<CatalogsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="auditoria" element={<AuditPage />} />

          {/* Alias conservados por compatibilidad con avances del sprint */}
          <Route path="bandeja" element={<Navigate to="/revision" replace />} />
          <Route path="seguimiento" element={<Navigate to="/revision" replace />} />
          <Route path="administraron" element={<Navigate to="/usuarios" replace />} />

          {/* Resto de rutas placeholder */}
          {Object.entries(pageDetails).map(([path, details]) => (
            <Route
              key={path}
              path={path.slice(1)}
              element={<PlaceholderPage details={details} />}
            />
          ))}
        </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
