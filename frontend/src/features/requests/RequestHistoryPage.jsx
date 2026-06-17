import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { FileText, Eye, AlertCircle, RefreshCw, Send, X, ExternalLink, Calendar } from "lucide-react";

export default function RequestHistoryPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAppealOpen, setIsAppealOpen] = useState(false);
  
  // Appeal form state
  const [appealJustification, setAppealJustification] = useState("");
  const [appealSubmitting, setAppealSubmitting] = useState(false);

  // Load history
  async function loadHistory() {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      const data = await apiClient.getMyRequests(user.username);
      setRequests(data);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("No se pudo cargar el historial de solicitudes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [user]);

  // Handle Edit/Correct click
  const handleCorrect = (reqCodeOrId) => {
    navigate(`/nueva-solicitud?edit=${reqCodeOrId}`);
  };

  // Open Appeal Modal
  const openAppeal = (req) => {
    setSelectedRequest(req);
    setAppealJustification("");
    setIsAppealOpen(true);
  };

  // Submit Appeal
  const submitAppeal = async (e) => {
    e.preventDefault();
    if (!appealJustification.trim()) {
      alert("Debe ingresar una justificación para la apelación.");
      return;
    }

    setAppealSubmitting(true);
    try {
      await apiClient.appealRequest(selectedRequest.id, appealJustification.trim());
      setIsAppealOpen(false);
      setSelectedRequest(null);
      // Reload history list
      await loadHistory();
      alert("Apelación enviada con éxito. Su solicitud volverá a ser evaluada.");
    } catch (err) {
      console.error("Error submitting appeal:", err);
      alert("Error al enviar la apelación: " + err.message);
    } finally {
      setAppealSubmitting(false);
    }
  };

  // Open View Details Modal
  const openViewDetails = (req) => {
    setSelectedRequest(req);
    setIsViewOpen(true);
  };

  // Helper to map status to lowercase for css pill mapping
  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === "pendiente") return "pendiente";
    if (s === "observada" || s === "observado") return "observada";
    if (s === "aprobada" || s === "aprobado") return "aprobada";
    if (s === "rechazada" || s === "rechazado") return "observada"; // Fallback to red style
    return "";
  };

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Estudiante</span>
        <h1>Historial de Solicitudes</h1>
        <p>
          Revise el estado de sus permisos anticipados, justificaciones posteriores, comentarios de revisión y respuestas emitidas por Dirección.
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
            <span className="eyebrow">Listado General</span>
            <h2>Mis Solicitudes de Ausencia</h2>
          </div>
          <button 
            onClick={loadHistory} 
            className="ghost-button" 
            type="button"
            disabled={loading}
            style={{ display: "inline-flex", gap: "6px" }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-500)" }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
            <p>Cargando historial de solicitudes...</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", border: "1px dashed var(--line)", borderRadius: "8px", background: "var(--surface-muted)" }}>
            <FileText size={40} style={{ color: "var(--ink-300)", marginBottom: "12px" }} />
            <h3>No se encontraron solicitudes</h3>
            <p style={{ color: "var(--ink-500)", margin: "4px 0 16px" }}>
              Usted no ha registrado ninguna solicitud de ausencia académica aún.
            </p>
            <button className="btn-primary" onClick={() => navigate("/nueva-solicitud")}>
              Crear nueva solicitud
            </button>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha Solicitud</th>
                  <th>Materias y Fechas Afectadas</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Evidencia</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.code}</strong>
                      <span style={{ fontSize: "11px", color: "var(--ink-500)", textTransform: "capitalize" }}>
                        {req.mode.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {new Date(parseInt(req.id.replace("req-", "")) || Date.now()).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {req.dates && req.dates.map((d, i) => (
                          <div key={i} style={{ fontSize: "13px" }}>
                            <span style={{ fontWeight: "600" }}>{d.courseName}</span>
                            <span style={{ color: "var(--ink-500)", marginLeft: "6px" }}>({d.date})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontWeight: "500" }}>
                        {req.reasonType}
                      </span>
                      <small style={{ display: "block", color: "var(--ink-700)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "200px" }}>
                        {req.reasonDetail}
                      </small>
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusClass(req.status)}`}>
                        {req.status}
                      </span>
                      {req.reviewComment && (
                        <div style={{ fontSize: "11px", color: "var(--danger)", marginTop: "4px", fontWeight: "600", maxWidth: "160px" }}>
                          Obs: {req.reviewComment}
                        </div>
                      )}
                    </td>
                    <td>
                      {req.evidenceUrl ? (
                        <a 
                          href={req.evidenceUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="evidence-link"
                          onClick={(e) => {
                            // If it's a blob url (mock preview), don't navigate directly in case of download block, but open safely
                            if (req.evidenceUrl.startsWith("blob:")) {
                              e.preventDefault();
                              window.open(req.evidenceUrl, "_blank");
                            }
                          }}
                        >
                          Ver Evidencia
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: "var(--ink-300)", fontSize: "12px" }}>Sin evidencia</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {/* CONDITIONAL ACTION BUTTONS BASED ON STATUS */}
                        {(req.status.toLowerCase() === "observada" || req.status.toLowerCase() === "observado") && (
                          <button
                            onClick={() => handleCorrect(req.id)}
                            className="btn-primary"
                            style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px" }}
                          >
                            Corregir
                          </button>
                        )}
                        
                        {(req.status.toLowerCase() === "rechazada" || req.status.toLowerCase() === "rechazado") && (
                          <button
                            onClick={() => openAppeal(req)}
                            className="btn-secondary btn-danger"
                            style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px" }}
                          >
                            Apelar
                          </button>
                        )}
                        
                        {(req.status.toLowerCase() === "aprobada" || req.status.toLowerCase() === "aprobado") && (
                          <button
                            onClick={() => openViewDetails(req)}
                            className="btn-secondary"
                            style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", gap: "4px" }}
                          >
                            <Eye size={14} />
                            Ver
                          </button>
                        )}

                        {/* Fallback for other statuses to view details */}
                        {req.status.toLowerCase() === "pendiente" && (
                          <button
                            onClick={() => openViewDetails(req)}
                            className="btn-secondary"
                            style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", gap: "4px" }}
                          >
                            <Eye size={14} />
                            Ver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {isViewOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsViewOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>
                Solicitud {selectedRequest.code}
              </h2>
              <button 
                onClick={() => setIsViewOpen(false)} 
                className="btn-icon-danger" 
                style={{ padding: "4px", marginLeft: "auto" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
              <div>
                <strong>Solicitante:</strong>
                <div>{selectedRequest.requesterName} (Estudiante)</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>Tipo de solicitud:</strong>
                  <div style={{ textTransform: "capitalize" }}>{selectedRequest.requestType.replace("_", " ")}</div>
                </div>
                <div>
                  <strong>Trámite:</strong>
                  <div style={{ textTransform: "capitalize" }}>{selectedRequest.mode.replace("_", " ")}</div>
                </div>
              </div>

              <div>
                <strong>Materias y Horarios Afectados:</strong>
                <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedRequest.dates.map((d, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", background: "var(--surface-muted)", padding: "8px", borderRadius: "6px", alignItems: "center" }}>
                      <Calendar size={14} style={{ color: "var(--ink-500)" }} />
                      <div>
                        <strong>{d.courseName}</strong>
                        <div style={{ fontSize: "12px", color: "var(--ink-500)" }}>Código: {d.courseCode} | Fecha: {d.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>Motivo:</strong>
                  <div style={{ textTransform: "capitalize" }}>{selectedRequest.reasonType}</div>
                </div>
                <div>
                  <strong>Estado:</strong>
                  <div style={{ marginTop: "4px" }}>
                    <span className={`status-pill ${getStatusClass(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <strong>Detalles / Justificación del Alumno:</strong>
                <div style={{ background: "var(--surface-muted)", padding: "10px", borderRadius: "6px", minHeight: "60px", whiteSpace: "pre-wrap" }}>
                  {selectedRequest.reasonDetail}
                </div>
              </div>

              {selectedRequest.evidenceUrl && (
                <div>
                  <strong>Documento Adjunto:</strong>
                  <div style={{ marginTop: "4px" }}>
                    <a 
                      href={selectedRequest.evidenceUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="evidence-link"
                    >
                      {selectedRequest.evidenceName || "certificado-medico.pdf"}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {selectedRequest.reviewComment && (
                <div style={{ borderTop: "1.5px dashed var(--danger)", paddingTop: "12px", marginTop: "4px" }}>
                  <strong style={{ color: "var(--danger)" }}>Comentarios de Revisión Académica:</strong>
                  <div style={{ background: "#fef3f2", border: "1px solid #fee4e2", color: "var(--danger)", padding: "10px", borderRadius: "6px", marginTop: "6px" }}>
                    {selectedRequest.reviewComment}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
              <button onClick={() => setIsViewOpen(false)} className="btn-primary">
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPEAL MODAL */}
      {isAppealOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsAppealOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>
                Apelar Solicitud Rechazada
              </h2>
              <button 
                onClick={() => setIsAppealOpen(false)} 
                className="btn-icon-danger" 
                style={{ padding: "4px", marginLeft: "auto" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitAppeal}>
              <div style={{ marginBottom: "16px", fontSize: "14px" }}>
                <p style={{ margin: "0 0 10px 0" }}>
                  Usted está apelando la solicitud <strong>{selectedRequest.code}</strong>. 
                  Explique detalladamente los motivos académicos o de fuerza mayor por los cuales solicita la reconsideración de Dirección.
                </p>
                
                {selectedRequest.reviewComment && (
                  <div style={{ background: "#fef3f2", color: "var(--danger)", padding: "8px 12px", borderRadius: "6px", borderLeft: "4px solid var(--danger)", marginBottom: "12px" }}>
                    <strong>Motivo de rechazo original:</strong> {selectedRequest.reviewComment}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="appealJustification">
                  Justificación de la Apelación
                </label>
                <textarea
                  id="appealJustification"
                  className="form-textarea"
                  placeholder="Detalle sus nuevos descargos o aclaraciones para la reconsideración de su caso..."
                  value={appealJustification}
                  onChange={(e) => setAppealJustification(e.target.value)}
                  disabled={appealSubmitting}
                  required
                />
              </div>

              <div className="form-actions" style={{ borderTop: "1px solid var(--line)", marginTop: "20px", paddingTop: "14px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAppealOpen(false)}
                  disabled={appealSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-danger"
                  disabled={appealSubmitting}
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <Send size={16} />
                  {appealSubmitting ? "Enviando Apelación..." : "Enviar Apelación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
