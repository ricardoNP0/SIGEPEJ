import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { apiClient } from "./api/client.js";
import LoginPage from "./features/auth/LoginPage.jsx";
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

const recentRequests = [
  { code: "SOL-2026-001", owner: "Ricardo Núñez", type: "Permiso anticipado", status: "pendiente", date: "2026-06-10" },
  { code: "SOL-2026-002", owner: "Daniel Escobar", type: "Justificación posterior", status: "observada", date: "2026-06-02" },
  { code: "SOL-2026-003", owner: "Ana Rojas", type: "Ausencia docente", status: "aprobada", date: "2026-06-12" },
];

function DashboardPage() {
  const [summary, setSummary] = useState({
    pendingRequests: 18,
    approvedRequests: 34,
    licenseRecords: 27,
    totalUsers: 9,
  });
  const [requests, setRequests] = useState(recentRequests);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [statsData, requestData] = await Promise.all([
          apiClient.getReportStats(),
          apiClient.getAllRequests("todos"),
        ]);

        if (!active) return;

        setSummary({
          pendingRequests: statsData?.summary?.pendingRequests ?? 0,
          approvedRequests: statsData?.summary?.approvedRequests ?? 0,
          licenseRecords: statsData?.summary?.licenseRecords ?? 0,
          totalUsers: statsData?.summary?.totalUsers ?? 0,
        });
        setRequests(
          requestData.slice(0, 3).map((item) => ({
            code: item.code,
            owner: item.requesterName || item.requesterUsername || "Usuario",
            type: item.requestType?.replaceAll("_", " ") || item.mode?.replaceAll("_", " ") || "Solicitud",
            status: item.status,
            date: item.dates?.[0]?.date || item.createdAt || "",
          }))
        );
      } catch (error) {
        console.warn("No se pudo cargar el dashboard desde API:", error.message);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const dashboardStats = [
    { label: "Solicitudes pendientes", value: summary.pendingRequests, detail: "Requieren revisión", icon: Clock3 },
    { label: "Aprobadas", value: summary.approvedRequests, detail: "Con registro de auditoría", icon: CheckCircle2 },
    { label: "Licencias aplicadas", value: summary.licenseRecords, detail: "Marcadas como L", icon: ShieldCheck },
    { label: "Usuarios demo", value: summary.totalUsers, detail: "Base seed cargada", icon: UsersRound },
  ];

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Resumen general</span>
        <h1>Panel SIGEPEJ</h1>
        <p>
          Base visual para que el equipo conecte solicitudes, asistencia,
          notificaciones, auditoría y reportes sin rehacer la navegación.
        </p>
      </div>

      <div className="stat-grid">
        {dashboardStats.map((item) => {
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
            {requests.map((request) => (
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
            Conecta solicitudes, asistencia, notificaciones, auditoría y reportes
            usando esta misma base de layout.
          </p>
        </section>
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
          <Route path="revision" element={<RevisionPage />} />
          <Route path="asistencia" element={<AttendancePage />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="catalogos" element={<CatalogsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="auditoria" element={<AuditPage />} />
          <Route path="historial" element={<Navigate to="/mis-solicitudes" replace />} />

          {/* Alias conservados por compatibilidad con avances del sprint */}
          <Route path="bandeja" element={<Navigate to="/revision" replace />} />
          <Route path="seguimiento" element={<Navigate to="/revision" replace />} />
          <Route path="administraron" element={<Navigate to="/usuarios" replace />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}


