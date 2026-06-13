import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, MessageSquare, Eye, X } from "lucide-react";
import "../requests/RevisionPage.css";

export default function RevisionPage() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pendiente");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar solicitudes
  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      // Para roles globales, obtener todas las solicitudes
      const allRequests = await apiClient.getAllRequests?.() || [];
      setRequests(allRequests.length > 0 ? allRequests : getMockAllRequests());
      filterRequests(allRequests.length > 0 ? allRequests : getMockAllRequests(), "pendiente");
    } catch (err) {
      console.error("Error loading requests:", err);
      const mockReqs = getMockAllRequests();
      setRequests(mockReqs);
      filterRequests(mockReqs, "pendiente");
    } finally {
      setLoading(false);
    }
  }

  function filterRequests(reqs, status) {
    const filtered = reqs.filter(r => r.status === status);
    setFilteredRequests(filtered);
  }

  useEffect(() => {
    loadRequests();
  }, [user]);

  // Handle status filter
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterRequests(requests, status);
  };

  // Open detail modal
  const openDetail = (request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  // Open action modal
  const openAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewComment("");
    setIsActionOpen(true);
  };

  // Submit review action
  const submitAction = async (e) => {
    e.preventDefault();
    if (actionType === "observada" && !reviewComment.trim()) {
      alert("Debe ingresar un comentario al observar una solicitud.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simular envío - en producción iría al backend
      const updatedRequest = {
        ...selectedRequest,
        status: actionType,
        reviewComment: reviewComment || "",
        reviewedBy: user?.username,
        reviewedAt: new Date().toISOString(),
      };

      // Actualizar en mock data
      const updatedRequests = requests.map(r => 
        r.id === selectedRequest.id || r.code === selectedRequest.code ? updatedRequest : r
      );
      setRequests(updatedRequests);
      filterRequests(updatedRequests, selectedStatus);

      setIsActionOpen(false);
      setSelectedRequest(null);
      alert(`Solicitud ${actionType === "aprobada" ? "aprobada" : actionType === "rechazada" ? "rechazada" : "observada"} exitosamente.`);
    } catch (err) {
      console.error("Error submitting action:", err);
      alert("Error al procesar la solicitud: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "pendiente") return "badge-pending";
    if (s === "observada") return "badge-observed";
    if (s === "aprobada") return "badge-approved";
    if (s === "rechazada") return "badge-rejected";
    return "";
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "aprobada") return <CheckCircle2 size={16} />;
    if (s === "rechazada") return <XCircle size={16} />;
    if (s === "observada") return <AlertCircle size={16} />;
    return null;
  };

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Dirección</span>
        <h1>Bandeja de Revisión</h1>
        <p>Revisa, aprueba, rechaza u observa solicitudes de ausencia y permisos.</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="revision-container">
        {/* Status Filter */}
        <div className="status-filter">
          <button
            className={`filter-btn ${selectedStatus === "pendiente" ? "active" : ""}`}
            onClick={() => handleStatusChange("pendiente")}
          >
            Pendientes
            <span className="count">
              {requests.filter(r => r.status === "pendiente").length}
            </span>
          </button>
          <button
            className={`filter-btn ${selectedStatus === "observada" ? "active" : ""}`}
            onClick={() => handleStatusChange("observada")}
          >
            Observadas
            <span className="count">
              {requests.filter(r => r.status === "observada").length}
            </span>
          </button>
          <button
            className={`filter-btn ${selectedStatus === "aprobada" ? "active" : ""}`}
            onClick={() => handleStatusChange("aprobada")}
          >
            Aprobadas
            <span className="count">
              {requests.filter(r => r.status === "aprobada").length}
            </span>
          </button>
          <button
            className={`filter-btn ${selectedStatus === "rechazada" ? "active" : ""}`}
            onClick={() => handleStatusChange("rechazada")}
          >
            Rechazadas
            <span className="count">
              {requests.filter(r => r.status === "rechazada").length}
            </span>
          </button>
          <button
            className="refresh-btn"
            onClick={loadRequests}
            disabled={loading}
            title="Actualizar"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Requests List */}
        <div className="requests-list">
          {loading ? (
            <div className="loading-state">
              <p>Cargando solicitudes...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div className="request-card" key={request.id || request.code}>
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.code || "N/A"}</h3>
                    <p className="requester">
                      {request.requesterName || "Solicitante"}
                      <span className="role">{request.requesterRole}</span>
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span className="label">Tipo:</span>
                    <span className="value">{request.requestType || request.type || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Motivo:</span>
                    <span className="value">{request.reasonType || request.reason || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Fecha:</span>
                    <span className="value">{request.date || request.createdAt || "N/A"}</span>
                  </div>
                  {request.reviewComment && (
                    <div className="detail-row">
                      <span className="label">Comentario:</span>
                      <span className="value comment">{request.reviewComment}</span>
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => openDetail(request)}
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                    Ver
                  </button>

                  {selectedStatus === "pendiente" && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => openAction(request, "aprobada")}
                        title="Aprobar"
                      >
                        <CheckCircle2 size={16} />
                        Aprobar
                      </button>
                      <button
                        className="action-btn observe-btn"
                        onClick={() => openAction(request, "observada")}
                        title="Observar"
                      >
                        <AlertCircle size={16} />
                        Observar
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => openAction(request, "rechazada")}
                        title="Rechazar"
                      >
                        <XCircle size={16} />
                        Rechazar
                      </button>
                    </>
                  )}

                  {selectedStatus === "observada" && (
                    <button
                      className="action-btn approve-btn"
                      onClick={() => openAction(request, "aprobada")}
                      title="Aprobar después de observación"
                    >
                      <CheckCircle2 size={16} />
                      Aprobar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No hay solicitudes con este estado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Solicitud</h2>
              <button
                className="close-btn"
                onClick={() => setIsDetailOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="grid-item">
                    <label>Código:</label>
                    <p>{selectedRequest.code}</p>
                  </div>
                  <div className="grid-item">
                    <label>Solicitante:</label>
                    <p>{selectedRequest.requesterName}</p>
                  </div>
                  <div className="grid-item">
                    <label>Rol:</label>
                    <p>{selectedRequest.requesterRole}</p>
                  </div>
                  <div className="grid-item">
                    <label>Estado:</label>
                    <p className={`status-badge ${getStatusBadgeClass(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Solicitud</h3>
                <div className="detail-grid">
                  <div className="grid-item">
                    <label>Tipo:</label>
                    <p>{selectedRequest.requestType || "N/A"}</p>
                  </div>
                  <div className="grid-item">
                    <label>Motivo:</label>
                    <p>{selectedRequest.reasonType || "N/A"}</p>
                  </div>
                  <div className="grid-item full-width">
                    <label>Detalle:</label>
                    <p>{selectedRequest.reasonDetail || "Sin detalles adicionales"}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.reviewComment && (
                <div className="detail-section">
                  <h3>Comentario del Revisor</h3>
                  <p>{selectedRequest.reviewComment}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setIsDetailOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {isActionOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setIsActionOpen(false)}>
          <div className="modal-content action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === "aprobada"
                  ? "Aprobar Solicitud"
                  : actionType === "rechazada"
                  ? "Rechazar Solicitud"
                  : "Observar Solicitud"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsActionOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitAction} className="modal-body">
              <div className="form-group">
                <label>Solicitud: {selectedRequest.code}</label>
                <p className="form-help">{selectedRequest.requesterName}</p>
              </div>

              {actionType === "observada" && (
                <div className="form-group">
                  <label htmlFor="comment">Comentario (obligatorio) *</label>
                  <textarea
                    id="comment"
                    className="form-control"
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Explica por qué observas esta solicitud..."
                    required
                  />
                </div>
              )}

              {actionType !== "observada" && (
                <div className="form-group">
                  <label htmlFor="comment">Comentario (opcional)</label>
                  <textarea
                    id="comment"
                    className="form-control"
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Agrega un comentario si lo deseas..."
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsActionOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`btn-primary ${
                    actionType === "aprobada"
                      ? "btn-approve"
                      : actionType === "rechazada"
                      ? "btn-reject"
                      : "btn-observe"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : 
                   actionType === "aprobada" ? "Aprobar" :
                   actionType === "rechazada" ? "Rechazar" :
                   "Observar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// Mock data for all requests
function getMockAllRequests() {
  return [
    {
      id: "req-001",
      code: "SOL-2026-001",
      requesterName: "Ricardo Nunez",
      requesterUsername: "ricardo_np",
      requesterRole: "estudiante",
      requestType: "permiso",
      reasonType: "salud",
      reasonDetail: "Consulta médica",
      status: "pendiente",
      date: "2026-06-10",
      createdAt: "2026-06-10",
      reviewComment: "",
    },
    {
      id: "req-002",
      code: "SOL-2026-002",
      requesterName: "Daniel Escobar",
      requesterUsername: "daniel_escobar",
      requesterRole: "estudiante",
      requestType: "ausencia",
      reasonType: "ausencia_estudiantil",
      reasonDetail: "Viaje familiar",
      status: "observada",
      date: "2026-06-02",
      createdAt: "2026-06-02",
      reviewComment: "Requerimos comprobante de viaje",
    },
    {
      id: "req-003",
      code: "SOL-2026-003",
      requesterName: "Ana Rojas",
      requesterUsername: "ana_rojas",
      requesterRole: "docente",
      requestType: "licencia",
      reasonType: "ausencia_docente",
      reasonDetail: "Licencia médica",
      status: "aprobada",
      date: "2026-06-12",
      createdAt: "2026-06-12",
      reviewComment: "",
    },
  ];
}
