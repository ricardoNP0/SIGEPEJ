import { Navigate, Route, Routes } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import StudentRequestForm from "./features/requests/StudentRequestForm.jsx";
import TeacherRequestForm from "./features/requests/TeacherRequestForm.jsx";
import RequestHistoryPage from "./features/requests/RequestHistoryPage.jsx";

const stats = [
  { label: "Solicitudes pendientes", value: "18", detail: "Requieren revision", icon: Clock3 },
  { label: "Aprobadas esta semana", value: "34", detail: "Con registro de auditoria", icon: CheckCircle2 },
  { label: "Licencias aplicadas", value: "27", detail: "Marcadas como L", icon: ShieldCheck },
  { label: "Usuarios demo", value: "9", detail: "Base seed cargada", icon: UsersRound },
];

const recentRequests = [
  { code: "SOL-2026-001", owner: "Ricardo Nunez", type: "Permiso anticipado", status: "pendiente", date: "2026-06-10" },
  { code: "SOL-2026-002", owner: "Daniel Escobar", type: "Justificacion posterior", status: "observada", date: "2026-06-02" },
  { code: "SOL-2026-003", owner: "Ana Rojas", type: "Ausencia docente", status: "aprobada", date: "2026-06-12" },
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
  "/notificaciones": {
    title: "Notificaciones",
    eyebrow: "Seguimiento",
    description: "Avisos de aprobacion, rechazo, observaciones, apelaciones y solicitudes pendientes segun el rol activo.",
    actions: ["Ver detalle", "Marcar como leida", "Abrir solicitud"],
  },
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
  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Resumen general</span>
        <h1>Panel SIGEPEJ</h1>
        <p>
          Base visual para que el equipo conecte solicitudes, asistencia,
          notificaciones, auditoria y reportes sin rehacer la navegacion.
        </p>
      </div>

      <div className="stat-grid">
        {stats.map((item) => {
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
              <h2>Solicitudes recientes</h2>
            </div>
            <button className="ghost-button" type="button">
              Ver todo
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="table-like" role="table" aria-label="Solicitudes recientes">
            {recentRequests.map((request) => (
              <div className="table-row" role="row" key={request.code}>
                <div>
                  <strong>{request.code}</strong>
                  <span>{request.owner}</span>
                </div>
                <div>
                  <span>{request.type}</span>
                  <small>{request.date}</small>
                </div>
                <span className={`status-pill ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Conexion</span>
              <h2>Backend configurado</h2>
            </div>
            <Activity size={22} className="muted-icon" aria-hidden="true" />
          </div>
          <div className="connection-box">
            <span>API local</span>
            <code>{import.meta.env.VITE_API_URL}</code>
          </div>
          <p className="panel-copy">
            Conecta solicitudes, asistencia, notificaciones, auditoria y reportes
            usando esta misma base de layout.
          </p>
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
          <Route path="historial" element={<RequestHistoryPage />} />

          {/* Rutas de redirección por rol segun Sprint 1 */}
          <Route path="bandeja" element={<PlaceholderPage details={pageDetails["/revision"]} />} />
          <Route path="seguimiento" element={<PlaceholderPage details={pageDetails["/revision"]} />} />
          <Route path="administraron" element={<PlaceholderPage details={pageDetails["/usuarios"]} />} />

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
