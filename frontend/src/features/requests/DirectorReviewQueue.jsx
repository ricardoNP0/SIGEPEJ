import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DirectorReviewQueue() {
  const { activeRole, token } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("todos");

  const [selectedView, setSelectedView] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const [comment, setComment] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const response = await fetch(
        `${API_URL}/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setRequests(data.requests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function review(status) {
    try {
      const response = await fetch(
        `${API_URL}/requests/${selectedReview._id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
            reviewComment: comment
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error");
      }

      setSelectedReview(null);
      setComment("");

      loadRequests();
    } catch (error) {
      console.error(error);
    }
  }

  const filteredRequests = useMemo(() => {
    if (filter === "todos") return requests;

    return requests.filter(
      (r) => r.status === filter
    );
  }, [requests, filter]);

  if (activeRole !== "director") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="content-stack">

      <div className="page-heading">
        <span className="eyebrow">
          Direccion
        </span>

        <h1>
          Bandeja de revision
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <button onClick={() => setFilter("todos")}>
          Todos
        </button>

        <button onClick={() => setFilter("pendiente")}>
          Pendientes
        </button>

        <button onClick={() => setFilter("observado")}>
          Observados
        </button>

        <button onClick={() => setFilter("rechazado")}>
          Rechazados
        </button>

        <button onClick={() => setFilter("apelado")}>
          Apelados
        </button>
      </div>

      <section className="surface-panel">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table width="100%">
            <thead>
              <tr>
                <th>Solicitante</th>
                <th>Tipo</th>
                <th>Fechas</th>
                <th>Materias</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    {request.requester
                      ? `${request.requester.firstName || ""} ${request.requester.lastName || ""}`
                      : "-"}
                  </td>

                  <td>
                    {request.requestType}
                  </td>

                  <td>
                    {request.dates?.map(
                      (item) =>
                        new Date(item.date)
                          .toLocaleDateString()
                    ).join(", ")}
                  </td>

                  <td>
                    {request.courses?.map(
                      (course) =>
                        course.code ||
                        course.subjectName
                    ).join(", ")}
                  </td>

                  <td>
                    {request.status}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        setSelectedView(request)
                      }
                    >
                      Ver
                    </button>

                    <button
                      onClick={() =>
                        setSelectedReview(request)
                      }
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedView && (
        <RequestModal
          title="Ver Solicitud"
          request={selectedView}
          onClose={() => setSelectedView(null)}
        />
      )}

      {selectedReview && (
        <ReviewModal
          request={selectedReview}
          comment={comment}
          setComment={setComment}
          onApprove={() => review("aprobado")}
          onObserve={() => review("observado")}
          onReject={() => review("rechazado")}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </section>
  );
  
}
function RequestModal({
  title,
  request,
  onClose
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal-window">

        <h2>{title}</h2>

        <p>
          <strong>Motivo:</strong>
          {request.reasonType}
        </p>

        <p>
          <strong>Detalle:</strong>
          {request.reasonDetail}
        </p>

        <p>
          <strong>Estado:</strong>
          {request.status}
        </p>

        {request.evidence?.url && (
          <a
            href={request.evidence.url}
            target="_blank"
            rel="noreferrer"
          >
            {request.evidence.originalName}
          </a>
        )}

        <button onClick={onClose}>
          Cerrar
        </button>

      </div>
    </div>
  );
}

function ReviewModal({
  request,
  comment,
  setComment,
  onApprove,
  onObserve,
  onReject,
  onClose
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal-window">

        <h2>Revisar Solicitud</h2>

        <p>{request.reasonDetail}</p>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Comentario"
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          <button onClick={onApprove}>
            Aprobar
          </button>

          <button onClick={onObserve}>
            Observar
          </button>

          <button onClick={onReject}>
            Rechazar
          </button>
        </div>

        <button onClick={onClose}>
          Cancelar
        </button>

      </div>
    </div>
  );
}