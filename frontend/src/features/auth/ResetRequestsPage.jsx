import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { AlertCircle, CheckCircle2, XCircle, Clock3, RefreshCw } from "lucide-react";

export default function ResetRequestsPage() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const canApprove = user && ["administrador", "director", "secretario"].includes(user.role);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPasswordResetRequests();
      setRequests(data.filter(r => r.status === "pendiente"));
    } catch (err) {
      console.error("Error loading reset requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleApprove = async (reqId) => {
    setActionMsg("");
    try {
      await apiClient.approvePasswordResetRequest(reqId, user.username);
      setRequests(prev => prev.filter(r => r._id !== reqId));
      setActionMsg("Solicitud aprobada. Se ha notificado al usuario.");
    } catch (err) {
      setActionMsg("Error: " + err.message);
    }
  };

  const handleReject = async (reqId) => {
    setActionMsg("");
    try {
      await apiClient.rejectPasswordResetRequest(reqId, user.username);
      setRequests(prev => prev.filter(r => r._id !== reqId));
      setActionMsg("Solicitud rechazada.");
    } catch (err) {
      setActionMsg("Error: " + err.message);
    }
  };

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Administración</span>
        <h1>Restablecimiento de Contraseñas</h1>
        <p>
          Revise y apruebe las solicitudes de restablecimiento de contraseña enviadas por los usuarios.
        </p>
      </div>

      {actionMsg && (
        <div className={`alert ${actionMsg.includes("Error") ? "alert-error" : "alert-success"}`}>
          {actionMsg.includes("Error") ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="surface-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Solicitudes Pendientes</span>
            <h2>Restablecimiento de Contraseña</h2>
          </div>
          <button onClick={loadRequests} className="btn-secondary" type="button" style={{ display: "inline-flex", gap: "6px" }}>
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-500)" }}>Cargando solicitudes...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-500)" }}>
            <Clock3 size={48} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p>No hay solicitudes pendientes de restablecimiento.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Fecha de solicitud</th>
                  {canApprove && <th style={{ textAlign: "right" }}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td><strong>{req.fullName}</strong></td>
                    <td>{req.username}</td>
                    <td>{req.email}</td>
                    <td>{new Date(req.createdAt).toLocaleString("es-ES")}</td>
                    {canApprove && (
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="btn-primary"
                          style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "6px" }}
                        >
                          <CheckCircle2 size={14} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="btn-danger"
                          style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <XCircle size={14} />
                          Rechazar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
