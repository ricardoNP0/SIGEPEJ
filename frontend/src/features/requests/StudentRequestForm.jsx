import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { AlertTriangle, FileText, Upload, CheckCircle2, ArrowLeft } from "lucide-react";

export default function StudentRequestForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit"); // Checks if editing an existing request

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [mode, setMode] = useState("permiso_anticipado");
  const [reasonType, setReasonType] = useState("academico");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [existingEvidenceName, setExistingEvidenceName] = useState("");

  // Load courses on component mount
  useEffect(() => {
    if (!user) return;
    
    async function loadData() {
      try {
        const data = await apiClient.getMyCourses(user.username, user.role);
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].code);
        }
      } catch (err) {
        console.error("Error al cargar materias:", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadData();
  }, [user]);

  // Load request data if editing
  useEffect(() => {
    if (!editId) return;

    async function loadRequest() {
      try {
        const requests = await apiClient.getMyRequests(user.username);
        const req = requests.find((r) => r.id === editId || r.code === editId);
        if (req) {
          setMode(req.mode);
          setReasonType(req.reasonType);
          if (req.dates && req.dates.length > 0) {
            setDate(req.dates[0].date);
            setSelectedCourse(req.dates[0].courseCode);
          }
          setReasonDetail(req.reasonDetail);
          setExistingEvidenceName(req.evidenceName || "");
        }
      } catch (err) {
        console.error("Error al cargar la solicitud:", err);
        setErrorMsg("No se pudo cargar la solicitud para editar.");
      }
    }
    
    if (user) {
      loadRequest();
    }
  }, [editId, user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!date) {
      setErrorMsg("Debe seleccionar una fecha de ausencia.");
      return;
    }
    if (!selectedCourse) {
      setErrorMsg("Debe seleccionar una materia.");
      return;
    }
    if (!reasonDetail.trim()) {
      setErrorMsg("Debe ingresar el detalle del motivo de su ausencia.");
      return;
    }

    // Strict evidence validation for "salud" (médica)
    const isSalud = reasonType === "salud";
    const hasFile = evidenceFile !== null;
    const hasExistingFile = !!existingEvidenceName;

    if (isSalud && !hasFile && !hasExistingFile) {
      setErrorMsg("La evidencia física (ej. certificado médico) es obligatoria para el motivo de Salud.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("requestType", "ausencia_estudiantil");
      formData.append("mode", mode);
      formData.append("reasonType", reasonType);
      formData.append("reasonDetail", reasonDetail.trim());
      formData.append("requesterRole", "estudiante");

      // Find course details
      const cObj = courses.find((c) => c.code === selectedCourse);
      const courseName = cObj ? cObj.subjectName : "Materia";

      // Append dates as array
      const datesArray = [{ date, courseCode: selectedCourse, courseName }];
      formData.append("dates", JSON.stringify(datesArray));

      if (evidenceFile) {
        formData.append("evidence", evidenceFile);
      }

      if (editId) {
        await apiClient.updateRequest(editId, formData);
        setSuccessMsg("¡Solicitud corregida y enviada con éxito!");
      } else {
        await apiClient.createRequest(formData);
        setSuccessMsg("¡Solicitud enviada con éxito!");
      }

      // Redirect immediately to history page after a brief delay
      setTimeout(() => {
        navigate("/historial");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Error al enviar la solicitud.");
      setSubmitting(false);
    }
  };

  return (
    <section className="content-stack form-container">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-secondary" 
          style={{ padding: "8px 12px", minHeight: "auto", display: "inline-flex", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <div className="page-heading">
        <span className="eyebrow">{editId ? "Corrección" : "Formulario Estudiantil"}</span>
        <h1>{editId ? "Corregir Solicitud Observada" : "Registrar Nueva Solicitud"}</h1>
        <p>
          Complete los datos detallados de su ausencia académica. Las ausencias por salud requieren adjuntar obligatoriamente el justificante correspondiente.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">
          <AlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <section className="surface-panel">
        <form onSubmit={handleSubmit}>
          {/* Mode Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="mode">Tipo de trámite</label>
            <select 
              id="mode" 
              className="form-select" 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={submitting || !!editId}
            >
              <option value="permiso_anticipado">Permiso Anticipado (Previa a la ausencia)</option>
              <option value="justificacion_posterior">Justificación Posterior (Máx. 48 hrs después)</option>
            </select>
          </div>

          <div className="form-row">
            {/* Reason Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="reasonType">Motivo principal</label>
              <select 
                id="reasonType" 
                className="form-select" 
                value={reasonType}
                onChange={(e) => setReasonType(e.target.value)}
                disabled={submitting}
              >
                <option value="academico">Actividad Académica Institucional</option>
                <option value="salud">Salud / Licencia Médica (Requiere justificante)</option>
                <option value="personal">Motivo Personal Particular</option>
                <option value="fuerza_mayor">Fuerza Mayor / Emergencia Familiar</option>
              </select>
            </div>

            {/* Course Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="course">Materia afectada</label>
              {loadingCourses ? (
                <div style={{ padding: "10px", fontSize: "14px", color: "var(--ink-500)" }}>
                  Cargando materias inscritas...
                </div>
              ) : (
                <select 
                  id="course" 
                  className="form-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={submitting || !!editId}
                >
                  {courses.length === 0 ? (
                    <option value="">No tiene materias asignadas</option>
                  ) : (
                    courses.map((c) => (
                      <option value={c.code} key={c.code}>
                        {c.subjectName} ({c.parallel})
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Date Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="date">Fecha de ausencia</label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting || !!editId}
              />
            </div>

            {/* Evidence File Picker */}
            <div className="form-group">
              <label className="form-label">
                Evidencia física {reasonType === "salud" && <span style={{ color: "var(--danger)" }}>* (Obligatoria)</span>}
              </label>
              
              <div 
                className="file-upload-zone"
                onClick={() => document.getElementById("evidence-upload").click()}
              >
                <Upload size={20} className="file-upload-icon" />
                <span style={{ fontSize: "13px", color: "var(--ink-700)" }}>
                  Haga clic para seleccionar archivo
                </span>
                <small style={{ fontSize: "11px", color: "var(--ink-500)" }}>
                  Formatos válidos: PDF, PNG, JPG hasta 10MB
                </small>
                <input
                  id="evidence-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={submitting}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </div>

              {evidenceFile && (
                <div className="file-name-preview">
                  Archivo seleccionado: {evidenceFile.name} ({(evidenceFile.size / 1024).toFixed(1)} KB)
                </div>
              )}

              {!evidenceFile && existingEvidenceName && (
                <div className="file-name-preview" style={{ color: "var(--ink-500)" }}>
                  Archivo actual: {existingEvidenceName}
                </div>
              )}
            </div>
          </div>

          {/* Reason Details */}
          <div className="form-group">
            <label className="form-label" htmlFor="reasonDetail">Detalle del motivo y justificación</label>
            <textarea
              id="reasonDetail"
              className="form-textarea"
              placeholder="Explique detalladamente la justificación de su inasistencia..."
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate("/historial")}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "Enviando..." : editId ? "Guardar Corrección" : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
