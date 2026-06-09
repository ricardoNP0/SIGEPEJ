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
  {
    code: "SOL-2026-014",
    owner: "Ana Rojas",
    type: "Ausencia estudiantil",
    status: "Pendiente",
    date: "2026-06-05",
  },
  {
    code: "SOL-2026-013",
    owner: "Carlos Mendez",
    type: "Permiso docente",
    status: "Observada",
    date: "2026-06-06",
  },
  {
    code: "SOL-2026-012",
    owner: "Ricardo Nunez",
    type: "Justificacion",
    status: "Aprobada",
    date: "2026-06-03",
  },
];

const pageDetails = {
  "/mis-solicitudes": {
    title: "Mis solicitudes",
    eyebrow: "Estudiante",
    description:
      "Historial de permisos, justificaciones, observaciones y respuestas emitidas por Direccion de Carrera.",
    actions: ["Ver estado", "Corregir observada", "Consultar evidencia"],
  },
  "/nueva-solicitud": {
    title: "Nueva solicitud estudiantil",
    eyebrow: "Formulario",
    description:
      "Formulario base para registrar una ausencia, seleccionar materia, fecha, motivo y evidencia cuando corresponda.",
    actions: ["Buscar estudiante", "Seleccionar materia", "Adjuntar evidencia"],
  },
  "/solicitud-docente": {
    title: "Solicitud docente",
    eyebrow: "Docente",
    description:
      "Pantalla para que un docente solicite ausencia por una o varias materias, una fecha o rangos de fechas.",
    actions: ["Elegir curso", "Definir fechas", "Notificar estudiantes"],
  },
  "/revision": {
    title: "Bandeja de revision",
    eyebrow: "Direccion",
    description:
      "Cola de solicitudes pendientes, observadas y apeladas para aprobar, rechazar u observar con comentario obligatorio.",
    actions: ["Aprobar", "Observar", "Rechazar"],
  },
  "/asistencia": {
    title: "Control de asistencia",
    eyebrow: "Docente",
    description:
      "Lista de estudiantes inscritos por materia y paralelo. Permite registrar P/F; las licencias L solo se aplican por solicitud aprobada.",
    actions: ["Elegir materia", "Registrar asistencia", "Ver licencias"],
  },
  "/notificaciones": {
    title: "Notificaciones",
    eyebrow: "Seguimiento",
    description:
      "Avisos de aprobacion, rechazo, observaciones, apelaciones y solicitudes pendientes segun el rol activo.",
    actions: ["Ver detalle", "Marcar como leida", "Abrir solicitud"],
  },
  "/reportes": {
    title: "Reportes",
    eyebrow: "Analitica",
    description:
      "Reportes por carrera, materia, estado, docente, estudiante y periodo academico para la defensa del proyecto.",
    actions: ["Filtrar", "Exportar", "Ver indicadores"],
  },
  "/catalogos": {
    title: "Catalogos academicos",
    eyebrow: "Base institucional",
    description:
      "Pantallas placeholder para carreras, materias, cursos, paralelos, docentes e inscripciones simuladas.",
    actions: ["Carreras", "Materias", "Inscripciones"],
  },
  "/usuarios": {
    title: "Usuarios y roles",
    eyebrow: "Administrador",
    description:
      "Administracion visual de estudiantes, docentes, directores, secretarios y permisos de acceso.",
    actions: ["Crear usuario", "Asignar rol", "Bloquear acceso"],
  },
  "/auditoria": {
    title: "Auditoria",
    eyebrow: "Trazabilidad",
    description:
      "Historial de aprobaciones, cambios de estado, fecha, hora, usuario responsable y motivo de cada accion critica.",
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
            Esta T01 solo arma el layout. Las tareas siguientes deben conectar
            login, solicitudes, revision y asistencia usando esta misma base.
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

const pageKeysToOverride = ["/nueva-solicitud", "/solicitud-docente", "/mis-solicitudes"];

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Real implemented routes for Sprint 1 */}
          <Route path="nueva-solicitud" element={<StudentRequestForm />} />
          <Route path="solicitud-docente" element={<TeacherRequestForm />} />
          <Route path="mis-solicitudes" element={<RequestHistoryPage />} />
          <Route path="historial" element={<RequestHistoryPage />} />
          
          {/* Redirects for role-based routes from Sprint 1 specification */}
          <Route path="bandeja" element={<PlaceholderPage details={pageDetails["/revision"]} />} />
          <Route path="seguimiento" element={<PlaceholderPage details={pageDetails["/revision"]} />} />
          <Route path="administraron" element={<PlaceholderPage details={pageDetails["/usuarios"]} />} />

          {/* Fallback mock routes from template */}
          {Object.entries(pageDetails)
            .filter(([path]) => !pageKeysToOverride.includes(path))
            .map(([path, details]) => (
              <Route
                key={path}
                path={path.slice(1)}
                element={<PlaceholderPage details={details} />}
              />
            ))}
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
