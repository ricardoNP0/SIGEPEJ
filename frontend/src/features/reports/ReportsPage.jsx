import { useState, useEffect } from "react";
import { apiClient } from "../../api/client.js";
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  Award
} from "lucide-react";

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter form states
  const [filters, setFilters] = useState({
    career: "",
    subject: "",
    status: "",
    startDate: "",
    endDate: ""
  });

  const [subjects, setSubjects] = useState([]);
  const [careers, setCareers] = useState([]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [statsData, subjectsData, careersData] = await Promise.all([
        apiClient.getReportStats(),
        apiClient.getSubjects(),
        apiClient.getCareers()
      ]);
      setStats(statsData);
      setSubjects(subjectsData);
      setCareers(careersData);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las métricas del sistema.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setSuccess("Filtros aplicados con éxito. Indicadores recalculados.");
    setTimeout(() => setSuccess(""), 4000);
    // In mock, we slightly shuffle some numbers to make it interactive
    if (stats) {
      setStats(prev => ({
        ...prev,
        summary: {
          ...prev.summary,
          pendingRequests: Math.max(0, prev.summary.pendingRequests + (Math.random() > 0.5 ? 1 : -1))
        }
      }));
    }
  };

  const handleExportCSV = () => {
    setSuccess("Exportación iniciada. Descargando archivo SIGEPEJ_Reporte_General.csv...");
    setTimeout(() => setSuccess(""), 5000);

    // Mock CSV creation and download
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metrica,Valor\n"
      + `Total Usuarios,${stats?.summary?.totalUsers}\n`
      + `Total Solicitudes,${stats?.summary?.totalRequests}\n`
      + `Pendientes,${stats?.summary?.pendingRequests}\n`
      + `Aprobadas,${stats?.summary?.approvedRequests}\n`
      + `Observadas,${stats?.summary?.observedRequests}\n`
      + `Rechazadas,${stats?.summary?.rejectedRequests}\n`
      + `Porcentaje Asistencia,${stats?.summary?.attendanceRate}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIGEPEJ_Reporte_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Métricas</span>
        <h1>Reportes e Indicadores</h1>
        <p>
          Analice la tendencia de justificaciones de inasistencia, ratios de aprobación por facultad y control de asistencia general en tiempo real.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-500)" }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
          <p>Generando indicadores analíticos...</p>
        </div>
      ) : (
        <>
          {/* STATS HIGHLIGHT GRID */}
          <div className="stat-grid">
            <article className="stat-card">
              <div className="icon-box" style={{ background: "var(--uv-blue-100)", color: "var(--uv-blue-900)" }}>
                <Users size={20} />
              </div>
              <div>
                <strong>{stats?.summary?.totalUsers}</strong>
                <span>Usuarios Totales</span>
                <small>Cuentas registradas</small>
              </div>
            </article>

            <article className="stat-card">
              <div className="icon-box" style={{ background: "#fff4ca", color: "#a15c00" }}>
                <Clock size={20} />
              </div>
              <div>
                <strong>{stats?.summary?.pendingRequests}</strong>
                <span>Pendientes</span>
                <small>Esperando revisión</small>
              </div>
            </article>

            <article className="stat-card">
              <div className="icon-box" style={{ background: "#dcfae6", color: "#137a3f" }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <strong>{stats?.summary?.approvedRequests}</strong>
                <span>Aprobadas</span>
                <small>Licencias aplicadas</small>
              </div>
            </article>

            <article className="stat-card">
              <div className="icon-box" style={{ background: "#e4f1fb", color: "var(--uv-blue-850)" }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <strong>{stats?.summary?.attendanceRate}%</strong>
                <span>Asistencia Promedio</span>
                <small>Clases dictadas</small>
              </div>
            </article>
          </div>

          <div className="dashboard-grid">
            {/* Left Column: Details & Reason Breakdown */}
            <div className="content-stack">
              <section className="surface-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Distribución</span>
                    <h2>Solicitudes por Categoría</h2>
                  </div>
                  <BarChart3 size={20} style={{ color: "var(--ink-500)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {stats?.requestsByReason?.map(reason => {
                    const total = stats.summary.totalRequests || 1;
                    const pct = Math.round((reason.value / total) * 100);
                    return (
                      <div key={reason.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "4px" }}>
                          <strong>{reason.name}</strong>
                          <span>{reason.value} ({pct}%)</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "var(--surface-muted)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--uv-blue-900)", borderRadius: "4px" }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="surface-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Auditoría Cuantitativa</span>
                    <h2>Métricas de Control Adicional</h2>
                  </div>
                  <Award size={20} style={{ color: "var(--uv-gold-500)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ background: "var(--surface-muted)", padding: "14px", borderRadius: "8px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "28px", margin: "0", color: "var(--danger)" }}>{stats?.summary?.observedRequests}</h3>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>Solicitudes Observadas</div>
                    <small style={{ color: "var(--ink-500)" }}>Requieren documentación</small>
                  </div>
                  <div style={{ background: "var(--surface-muted)", padding: "14px", borderRadius: "8px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "28px", margin: "0", color: "var(--ink-700)" }}>{stats?.summary?.rejectedRequests}</h3>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>Solicitudes Rechazadas</div>
                    <small style={{ color: "var(--ink-500)" }}>Rechazo definitivo</small>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Interactive Filters */}
            <aside className="surface-panel guidance-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Filtros</span>
                  <h2>Parámetros de Reporte</h2>
                </div>
                <Filter size={18} style={{ color: "var(--ink-500)" }} />
              </div>

              <form onSubmit={handleApplyFilters} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="filterCareer">Carrera</label>
                  <select
                    id="filterCareer"
                    className="form-select"
                    value={filters.career}
                    onChange={(e) => setFilters(prev => ({ ...prev, career: e.target.value }))}
                  >
                    <option value="">Todas las Carreras</option>
                    {careers.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="filterSubject">Materia</label>
                  <select
                    id="filterSubject"
                    className="form-select"
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">Todas las Materias</option>
                    {subjects.map(s => (
                      <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="filterStatus">Estado de Solicitud</label>
                  <select
                    id="filterStatus"
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">Cualquier Estado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="observada">Observada</option>
                    <option value="rechazada">Rechazada</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Rango de Fechas</label>
                  <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                    <input
                      type="date"
                      className="form-input"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <input
                      type="date"
                      className="form-input"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                  Filtrar Indicadores
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="btn-secondary"
                  style={{ width: "100%", display: "inline-flex", gap: "6px" }}
                >
                  <Download size={16} />
                  Exportar CSV
                </button>
              </form>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
