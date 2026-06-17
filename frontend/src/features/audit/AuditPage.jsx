import { useState, useEffect } from "react";
import { apiClient } from "../../api/client.js";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
  Eye,
  Clock,
  User,
  X
} from "lucide-react";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Detailed Modal for metadata inspection
  const [selectedLog, setSelectedLog] = useState(null);

  async function loadLogs() {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los registros de auditoría.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionLabel = (action) => {
    switch (action) {
      case "crear_solicitud": return "Creó Solicitud";
      case "observar_solicitud": return "Observó Solicitud";
      case "aprobar_solicitud": return "Aprobó Solicitud";
      case "rechazar_solicitud": return "Rechazó Solicitud";
      case "crear_usuario": return "Creó Usuario";
      case "bloquear_usuario": return "Bloqueó Acceso";
      case "desbloquear_usuario": return "Habilitó Acceso";
      case "cambiar_rol": return "Cambió Rol";
      case "crear_carrera": return "Registró Carrera";
      case "crear_materia": return "Registró Materia";
      case "crear_paralelo": return "Registró Paralelo";
      default: return action.replace("_", " ");
    }
  };

  const getActionClass = (action) => {
    if (action.includes("crear") || action.includes("desbloquear") || action.includes("aprobar")) {
      return "aprobada"; // green
    }
    if (action.includes("bloquear") || action.includes("rechazar")) {
      return "observada"; // red
    }
    return "pendiente"; // yellow/orange
  };

  const filteredLogs = logs.filter(log => {
    const actorName = `${log.actor?.firstName || ""} ${log.actor?.lastName || ""} ${log.actor?.username || ""}`.toLowerCase();
    const actionDesc = getActionLabel(log.action).toLowerCase();
    const entityType = (log.entityType || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return actorName.includes(search) || actionDesc.includes(search) || entityType.includes(search);
  });

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Seguridad</span>
        <h1>Auditoría del Sistema</h1>
        <p>
          Trazabilidad completa de las acciones críticas realizadas por administradores, directores, docentes y estudiantes dentro de SIGEPEJ.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="surface-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Trazabilidad</span>
            <h2>Historial de Auditoría</h2>
          </div>
          <button
            onClick={loadLogs}
            className="ghost-button"
            type="button"
            disabled={loading}
            style={{ display: "inline-flex", gap: "6px" }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Actualizar
          </button>
        </div>

        {/* Filters bar */}
        <div style={{ marginBottom: "20px" }}>
          <label className="search-box" style={{ width: "100%", maxWidth: "none" }}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Filtrar por actor, acción o tipo de entidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-500)" }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
            <p>Obteniendo registros de auditoría...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", border: "1px dashed var(--line)", borderRadius: "8px", background: "var(--surface-muted)" }}>
            <ShieldCheck size={40} style={{ color: "var(--ink-300)", marginBottom: "12px" }} />
            <h3>No se encontraron registros</h3>
            <p style={{ color: "var(--ink-500)", margin: "4px 0" }}>
              Ningún registro de auditoría coincide con los filtros especificados.
            </p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Actor (Usuario)</th>
                  <th>Rol</th>
                  <th>Acción Realizada</th>
                  <th>Entidad Afectada</th>
                  <th style={{ textAlign: "right" }}>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id || log.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                        <Clock size={14} style={{ color: "var(--ink-500)" }} />
                        {new Date(log.createdAt || Date.now()).toLocaleString("es-ES")}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={14} style={{ color: "var(--ink-500)" }} />
                        <div>
                          <strong>{log.actor?.firstName ? `${log.actor.firstName} ${log.actor.lastName}` : "Sistema / Demo"}</strong>
                          {log.actor?.username && (
                            <span style={{ fontSize: "12px", color: "var(--ink-500)", display: "block" }}>
                              @{log.actor.username} {log.actor.code ? `(${log.actor.code})` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "600", color: "var(--ink-700)" }}>
                        {log.actor?.role || "SYSTEM"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${getActionClass(log.action)}`} style={{ textTransform: "capitalize", fontSize: "12px", display: "inline-block" }}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: "12px", background: "var(--surface-muted)", padding: "2px 6px", borderRadius: "4px" }}>
                        {log.entityType || "N/A"}
                      </code>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn-secondary"
                        style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", gap: "4px" }}
                      >
                        <Eye size={14} />
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* METADATA INSPECTOR MODAL */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "min(500px, 90vw)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>
                Detalles del Log
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="btn-icon-danger"
                style={{ padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <div>
                <strong>Acción:</strong> {getActionLabel(selectedLog.action)} (<code>{selectedLog.action}</code>)
              </div>
              <div>
                <strong>Entidad:</strong> {selectedLog.entityType || "N/A"} (ID: <code>{selectedLog.entityId || "N/A"}</code>)
              </div>
              <div>
                <strong>Fecha y Hora:</strong> {new Date(selectedLog.createdAt || Date.now()).toLocaleString("es-ES")}
              </div>
              <div>
                <strong>Datos del Evento (Metadatos):</strong>
                <pre style={{
                  background: "var(--uv-blue-100)",
                  color: "var(--uv-blue-950)",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  overflowX: "auto",
                  marginTop: "6px",
                  border: "1px solid var(--line)"
                }}>
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
              <button onClick={() => setSelectedLog(null)} className="btn-primary">
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
