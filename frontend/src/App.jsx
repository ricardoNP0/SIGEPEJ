import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
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
} from "lucide-react";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
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
  { label: "Usuarios demo", value: "9", detail: "Base seed cargada", icon: UsersRound },
];

const recentRequests = [
  { code: "SOL-2026-001", owner: "Ricardo Nunez", type: "Permiso anticipado", status: "pendiente", date: "2026-06-10" },
  { code: "SOL-2026-002", owner: "Daniel Escobar", type: "Justificacion posterior", status: "observada", date: "2026-06-02" },
  { code: "SOL-2026-003", owner: "Ana Rojas", type: "Ausencia docente", status: "aprobada", date: "2026-06-12" },
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
  "/revision": {
    title: "Bandeja de revision",
    eyebrow: "Direccion",
    description: "Cola de solicitudes pendientes, observadas y apeladas para aprobar, rechazar u observar con comentario obligatorio.",
    actions: ["Aprobar", "Observar", "Rechazar"],
  },
  "/asistencia": {
    title: "Control de asistencia",
    eyebrow: "Docente",
    description: "Lista de estudiantes inscritos por materia y paralelo. Permite registrar P/F; las licencias L solo se aplican por solicitud aprobada.",
    actions: ["Elegir materia", "Registrar asistencia", "Ver licencias"],
  },
};

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para datos dinámicos
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el rol actual y normalizarlo
  const userRole = user?.role?.toLowerCase() || "estudiante";

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
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        if (isStudent) {
          // Obtener solicitudes del estudiante
          const userRequests = await apiClient.getMyRequests(user.username);
          setRequests(userRequests);

          // Calcular estadísticas dinámicamente
          const sentCount = userRequests.length;
          const approvedPermits = userRequests.filter(r => 
            r.status === "aprobada" && (r.requestType === "permiso" || r.reasonType === "permisos")
          ).length;
          const justifiedAbsences = userRequests.filter(r => 
            r.status === "aprobada" && (r.requestType === "ausencia" || r.reasonType === "ausencia_docente")
          ).length;
          const pendingAbsences = userRequests.filter(r => 
            (r.status === "pendiente" || r.status === "observada") && (r.requestType === "ausencia" || r.reasonType === "ausencia_docente")
          ).length;

          setStats([
            { label: "Mis solicitudes enviadas", value: String(sentCount), detail: "En revisión y aprobadas", icon: FileText },
            { label: "Permisos aprobados", value: String(approvedPermits), detail: "Disponibles para usar", icon: CheckCircle2 },
            { label: "Faltas justificadas", value: String(justifiedAbsences), detail: "Con permiso autorizado", icon: ShieldCheck },
            { label: "Faltas por justificar", value: String(pendingAbsences), detail: "Requiere trámite", icon: AlertCircle },
          ]);
        } else if (isTeacher) {
          const userRequests = await apiClient.getMyRequests(user.username);
          setRequests(userRequests);

          const requestedLicenses = userRequests.length;
          const classesWithSubstitution = userRequests.filter(r => r.status === "aprobada").length;

          setStats([
            { label: "Mis licencias solicitadas", value: String(requestedLicenses), detail: "Permisos pendientes", icon: Briefcase },
            { label: "Clases con suplencia", value: String(classesWithSubstitution), detail: "Programadas este mes", icon: BookOpen },
            { label: "Porcentaje de asistencia", value: "94%", detail: "Mes actual", icon: CheckSquare },
          ]);
        } else {
          // Para roles globales, usar datos estáticos por ahora
          setStats(globalStats);
          setRequests(recentRequests);
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
          setRequests(recentRequests);
        }
      } finally {
        setLoading(false);
      }
    }

    if (user?.username) {
      loadDashboardData();
    }
  }, [user, isStudent, isTeacher]);

  // Seleccionar datos según rol
  const displayStats = stats.length > 0 ? stats : (isStudent ? [] : isTeacher ? [] : globalStats);
  const displayRequests = requests.length > 0 ? requests : recentRequests;

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">{isGlobalRole ? "Resumen general" : isStudent ? "Tu gestión" : "Gestión docente"}</span>
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
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
                    <small>{request.date || request.createdAt}</small>
                  </div>
                  <span className={`status-pill ${(request.status || "").toLowerCase()}`}>
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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
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
          <Route path="historial" element={<Navigate to="/mis-solicitudes" replace />} />
          <Route path="notificaciones" element={<NotificationsPage />} />

          {/* Rutas de Administrador */}
          <Route path="usuarios" element={<UsersPage />} />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
