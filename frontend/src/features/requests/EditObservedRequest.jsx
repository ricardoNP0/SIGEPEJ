import { useState } from "react";
import apiClient from "../../api/client.js";

export default function EditObservedRequest({
  request,
  onClose,
  onSuccess
}) {
  const [reasonDetail, setReasonDetail] = useState(request.reasonDetail || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ];

    if (!allowed.includes(selected.type)) {
      alert("Solo PDF, PNG o JPG");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!reasonDetail.trim()) {
      alert("Ingrese el detalle de la corrección.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("reasonDetail", reasonDetail);
      if (file) {
        formData.append("evidence", file);
      }

      await apiClient.patch(
        `/requests/${request._id}/correct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Solicitud corregida y enviada nuevamente");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al corregir solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Corregir solicitud observada</h2>
          <button className="btn-icon-danger" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Comentario del director</label>
            <div className="review-comment-box">
              {request.reviewComment || "Sin comentario disponible."}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reasonDetail">
              Detalle corregido
            </label>
            <textarea
              id="reasonDetail"
              className="form-textarea"
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="evidenceUpload">
              Nueva evidencia
            </label>
            <input
              id="evidenceUpload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFile}
            />
            {file && (
              <div className="file-name-preview">
                Archivo seleccionado: {file.name}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar corrección"}
          </button>
        </div>
      </div>
    </div>
  );
}
