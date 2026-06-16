import { useState } from "react";
import { apiClient } from "../../api/client";
import { X, Send } from "lucide-react";

export default function AppealForm({
  request,
  onClose,
  onSuccess
}) {
  const [appealComment, setAppealComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert("Solo PDF, PNG o JPG");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!appealComment.trim()) {
      alert("Debe ingresar un argumento de apelación");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("appealComment", appealComment);

      if (file) {
        formData.append("evidence", file);
      }

      await apiClient.patch(
        `/requests/${request._id || request.id}/appeal`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Apelación enviada");
      onSuccess();

    } catch (error) {
      console.error(error);
      alert("Error al enviar apelación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "12px"
        }}>
          <h2 className="modal-title" style={{ marginBottom: 0 }}>
            Apelar solicitud rechazada
          </h2>
          <button
            onClick={onClose}
            className="btn-icon-danger"
            style={{ padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "var(--ink-900)"
          }}>
            Comentario del Director:
          </label>
          <div style={{
            backgroundColor: "var(--bg-light)",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "13px",
            color: "var(--ink-700)",
            borderLeft: "3px solid var(--danger)"
          }}>
            {request.reviewComment || "Sin comentario"}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "var(--ink-900)"
          }}>
            Argumento de apelación
          </label>
          <textarea
            value={appealComment}
            onChange={(e) => setAppealComment(e.target.value)}
            placeholder="Explique por qué la solicitud debe ser reconsiderada..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "10px",
              fontSize: "13px",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "var(--ink-900)"
          }}>
            Evidencia adicional (opcional)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              fontSize: "13px",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          />
          {file && (
            <small style={{
              display: "block",
              marginTop: "6px",
              color: "var(--success)",
              fontWeight: "600"
            }}>
              ✓ {file.name}
            </small>
          )}
        </div>

        <div style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          paddingTop: "16px",
          borderTop: "1px solid var(--line)"
        }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: "13px"
            }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              display: "inline-flex",
              gap: "6px",
              alignItems: "center"
            }}
            disabled={loading}
          >
            <Send size={14} />
            {loading ? "Enviando..." : "Enviar apelación"}
          </button>
        </div>
      </div>
    </div>
  );
}
