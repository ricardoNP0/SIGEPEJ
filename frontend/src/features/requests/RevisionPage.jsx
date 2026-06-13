import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, RefreshCw, Search, X } from "lucide-react";
import { apiClient } from "../../api/client.js";

const filters = [
  { value: "todos", label: "Todas" },
  { value: "pendiente", label: "Pendientes" },
  { value: "observado", label: "Observadas" },
  { value: "apelado", label: "Apeladas" },
  { value: "aprobado", label: "Aprobadas" },
  { value: "rechazado", label: "Rechazadas" },
];

function getRequestId(request) {
  return request.id || request._id;
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "aprobado" || normalized === "aprobada") return "aprobada";
  if (normalized === "observado" || normalized === "observada") return "observada";
  if (normalized === "rechazado" || normalized === "rechazada") return "rechazada";
  if (normalized === "apelado" || normalized === "apelada") return "apelada";
  return "pendiente";
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

export default function RevisionPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pendiente");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionRequest, setActionRequest] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getAllRequests(statusFilter);
      setRequests(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar la bandeja de revision.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return requests;

    return requests.filter((request) => {
      const haystack = [
        request.code,
        request.requesterName,
        request.requesterUsername,
        request.reasonType,
        request.reasonDetail,
        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [requests, search]);

  function openAction(request, status) {
    setActionRequest(request);
    setActionStatus(status);
    setReviewComment("");
    setMessage("");
    setError("");
  }

  async function submitReview(event) {
    event.preventDefault();
    if (!actionRequest) return;

    if (["observado", "rechazado"].includes(actionStatus) && reviewComment.trim().length < 5) {
      setError("Para observar o rechazar se requiere un comentario claro.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await apiClient.reviewRequest(getRequestId(actionRequest), actionStatus, reviewComment.trim());
      setMessage("Solicitud revisada correctamente.");
      setActionRequest(null);
      setReviewComment("");
      await loadRequests();
    } catch (err) {
      setError(err.message || "No se pudo revisar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Direccion / Secretaria</span>
        <h1>Bandeja de revision</h1>
        <p>
          Revisa solicitudes pendientes, observadas y apeladas. Al aprobar, el sistema aplica el impacto automatico en asistencia.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <section className="surface-panel">
        <div className="review-toolbar">
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                className={`filter-tab ${statusFilter === filter.value ? "active" : ""}`}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar solicitud o usuario"
            />
          </label>

          <button className="btn-secondary compact-button" type="button" onClick={loadRequests}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Cargando solicitudes...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="empty-state">No hay solicitudes para este filtro.</p>
        ) : (
          <div className="history-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Solicitante</th>
                  <th>Tipo</th>
                  <th>Fechas / Materias</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={getRequestId(request)}>
                    <td>
                      <strong>{request.code}</strong>
                      <small className="muted-block">{request.mode?.replace("_", " ")}</small>
                    </td>
                    <td>
                      <strong>{request.requesterName || "Usuario"}</strong>
                      <small className="muted-block">{request.requesterRole}</small>
                    </td>
                    <td>
                      <span>{request.requestType?.replace("_", " ")}</span>
                      <small className="muted-block">{request.reasonType}</small>
                    </td>
                    <td>
                      <div className="date-list">
                        {(request.dates || []).map((item, index) => (
                          <span key={`${getRequestId(request)}-${index}`}>
                            {formatDate(item.date)} - {item.courseName || item.courseCode || "Materia"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${statusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-secondary compact-button" type="button" onClick={() => setSelectedRequest(request)}>
                          <Eye size={15} />
                          Ver
                        </button>
                        {["pendiente", "observado", "apelado"].includes(String(request.status).toLowerCase()) && (
                          <>
                            <button className="btn-primary compact-button" type="button" onClick={() => openAction(request, "aprobado")}>
                              Aprobar
                            </button>
                            <button className="btn-secondary compact-button" type="button" onClick={() => openAction(request, "observado")}>
                              Observar
                            </button>
                            <button className="btn-secondary compact-button danger-outline" type="button" onClick={() => openAction(request, "rechazado")}>
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content large-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelectedRequest(null)}>
              <X size={18} />
            </button>
            <h2 className="modal-title">Detalle {selectedRequest.code}</h2>
            <div className="detail-grid">
              <span>Solicitante</span>
              <strong>{selectedRequest.requesterName}</strong>
              <span>Estado</span>
              <strong>{selectedRequest.status}</strong>
              <span>Motivo</span>
              <strong>{selectedRequest.reasonType}</strong>
              <span>Detalle</span>
              <p>{selectedRequest.reasonDetail}</p>
              <span>Comentario revision</span>
              <p>{selectedRequest.reviewComment || "Sin comentario"}</p>
              <span>Apelacion</span>
              <p>{selectedRequest.appealComment || "Sin apelacion"}</p>
            </div>
          </div>
        </div>
      )}

      {actionRequest && (
        <div className="modal-overlay" onClick={() => setActionRequest(null)}>
          <form className="modal-content" onSubmit={submitReview} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setActionRequest(null)}>
              <X size={18} />
            </button>
            <h2 className="modal-title">Revisar {actionRequest.code}</h2>
            <p className="panel-copy">
              Accion seleccionada: <strong>{actionStatus}</strong>. Para observar o rechazar, el comentario queda como evidencia de auditoria.
            </p>
            <label className="form-group">
              <span className="form-label">Comentario de revision</span>
              <textarea
                className="form-textarea"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Ejemplo: Se aprueba por evidencia valida / Adjuntar documento legible"
              />
            </label>
            <div className="form-actions">
              <button className="btn-secondary" type="button" onClick={() => setActionRequest(null)}>
                Cancelar
              </button>
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
