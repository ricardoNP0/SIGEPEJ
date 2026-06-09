import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { Plus, Trash2, CheckCircle2, AlertTriangle, ArrowLeft, Calendar } from "lucide-react";

export default function TeacherRequestForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [reasonType, setReasonType] = useState("academico");
  const [reasonDetail, setReasonDetail] = useState("");
  
  // Checkboxes for selected courses
  const [selectedCourses, setSelectedCourses] = useState({}); // { courseCode: boolean }
  
  // Dynamic dates: list of { date: string, courseCode: string }
  const [datesList, setDatesList] = useState([{ date: "", courseCode: "" }]);

  // Load teacher's assigned courses
  useEffect(() => {
    if (!user) return;

    async function loadCourses() {
      try {
        const data = await apiClient.getMyCourses(user.username, user.role);
        setMyCourses(data);
        
        // Auto-select all by default in checkbox state
        const initialSelections = {};
        data.forEach(c => {
          initialSelections[c.code] = true;
        });
        setSelectedCourses(initialSelections);

        // Prepopulate first date row courseCode if available
        if (data.length > 0) {
          setDatesList([{ date: "", courseCode: data[0].code }]);
        }
      } catch (err) {
        console.error("Error al cargar materias de docente:", err);
        setErrorMsg("No se pudieron cargar sus materias asignadas.");
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, [user]);

  // Handle course checkbox change
  const handleCheckboxChange = (code) => {
    setSelectedCourses(prev => {
      const next = { ...prev, [code]: !prev[code] };
      
      // Update existing date rows if a course is unchecked
      if (!next[code]) {
        setDatesList(currentList => 
          currentList.map(row => 
            row.courseCode === code 
              ? { ...row, courseCode: Object.keys(next).find(k => next[k]) || "" } 
              : row
          )
        );
      }
      return next;
    });
  };

  // Add a new dynamic date row
  const addDateRow = () => {
    // Find the first active course
    const firstActiveCourse = Object.keys(selectedCourses).find(k => selectedCourses[k]) || "";
    setDatesList(prev => [...prev, { date: "", courseCode: firstActiveCourse }]);
  };

  // Remove a dynamic date row
  const removeDateRow = (index) => {
    if (datesList.length === 1) {
      setErrorMsg("Debe incluir al menos una fecha y materia en su solicitud.");
      return;
    }
    setDatesList(prev => prev.filter((_, i) => i !== index));
  };

  // Update a specific date row field
  const updateDateRow = (index, field, value) => {
    setDatesList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Get only the checked course list objects
  const getCheckedCoursesList = () => {
    return myCourses.filter(c => selectedCourses[c.code]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const checkedCourses = getCheckedCoursesList();
    if (checkedCourses.length === 0) {
      setErrorMsg("Debe seleccionar al menos una materia asignada.");
      return;
    }

    // Validate date rows
    for (let i = 0; i < datesList.length; i++) {
      const row = datesList[i];
      if (!row.date) {
        setErrorMsg(`La fecha en la fila #${i + 1} no es válida.`);
        return;
      }
      if (!row.courseCode) {
        setErrorMsg(`Seleccione una materia para la fecha en la fila #${i + 1}.`);
        return;
      }
    }

    if (!reasonDetail.trim()) {
      setErrorMsg("Por favor ingrese el detalle o justificativo de la ausencia.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("requestType", "ausencia_docente");
      formData.append("mode", "permiso_anticipado"); // Teachers usually do advance permissions
      formData.append("reasonType", reasonType);
      formData.append("reasonDetail", reasonDetail.trim());
      formData.append("requesterRole", "docente");

      // Build dates array
      const formattedDates = datesList.map(row => {
        const cObj = myCourses.find(c => c.code === row.courseCode);
        return {
          date: row.date,
          courseCode: row.courseCode,
          courseName: cObj ? cObj.subjectName : "Materia"
        };
      });

      formData.append("dates", JSON.stringify(formattedDates));

      await apiClient.createRequest(formData);
      setSuccessMsg("¡Solicitud docente enviada con éxito!");

      setTimeout(() => {
        navigate("/dashboard");
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
        <span className="eyebrow">Formulario Docente</span>
        <h1>Registrar Ausencia de Docente</h1>
        <p>
          Solicite licencia académica o médica. Permite seleccionar múltiples materias asignadas y registrar distintas fechas no necesariamente consecutivas.
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
          {/* Reason Type */}
          <div className="form-group">
            <label className="form-label" htmlFor="reasonType">Motivo de la ausencia</label>
            <select 
              id="reasonType" 
              className="form-select" 
              value={reasonType}
              onChange={(e) => setReasonType(e.target.value)}
              disabled={submitting}
            >
              <option value="academico">Capacitación / Comisión Institucional</option>
              <option value="salud">Salud / Incapacidad Médica</option>
              <option value="personal">Asuntos Particulares</option>
              <option value="fuerza_mayor">Emergencia o Fuerza Mayor</option>
            </select>
          </div>

          {/* Courses selection via checkboxes */}
          <div className="form-group">
            <label className="form-label">Materias y paralelos afectados</label>
            {loadingCourses ? (
              <div style={{ padding: "10px", color: "var(--ink-500)", fontSize: "14px" }}>
                Cargando sus materias asignadas...
              </div>
            ) : myCourses.length === 0 ? (
              <div style={{ padding: "10px", color: "var(--danger)", fontSize: "14px" }}>
                No tiene materias asignadas registradas en el sistema.
              </div>
            ) : (
              <div className="form-checkbox-group">
                {myCourses.map((c) => (
                  <label key={c.code} className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={!!selectedCourses[c.code]}
                      onChange={() => handleCheckboxChange(c.code)}
                      disabled={submitting}
                    />
                    <div>
                      <strong>{c.subjectName}</strong>
                      <small style={{ display: "block", color: "var(--ink-500)", fontSize: "11px" }}>
                        {c.code} ({c.parallel})
                      </small>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic date/materia adder */}
          <div className="form-group" style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "10px" }}>
              <label className="form-label">Fechas e inasistencias específicas</label>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "4px 10px", minHeight: "auto", display: "inline-flex", gap: "4px", fontSize: "13px", marginLeft: "auto" }}
                onClick={addDateRow}
                disabled={submitting || getCheckedCoursesList().length === 0}
              >
                <Plus size={14} />
                Agregar Fecha
              </button>
            </div>

            <div className="dates-container">
              {datesList.map((row, index) => (
                <div key={index} className="date-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} style={{ color: "var(--ink-500)" }} />
                    <input
                      type="date"
                      className="form-input"
                      style={{ padding: "6px 10px" }}
                      value={row.date}
                      onChange={(e) => updateDateRow(index, "date", e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <select
                      className="form-select"
                      style={{ padding: "6px 10px" }}
                      value={row.courseCode}
                      onChange={(e) => updateDateRow(index, "courseCode", e.target.value)}
                      disabled={submitting}
                    >
                      <option value="" disabled>Seleccione materia...</option>
                      {getCheckedCoursesList().map((c) => (
                        <option value={c.code} key={c.code}>
                          {c.subjectName} ({c.parallel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="btn-icon-danger"
                      onClick={() => removeDateRow(index)}
                      disabled={submitting}
                      title="Eliminar fila"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason Detail */}
          <div className="form-group" style={{ marginTop: "24px" }}>
            <label className="form-label" htmlFor="reasonDetail">Descripción y justificación detallada</label>
            <textarea
              id="reasonDetail"
              className="form-textarea"
              placeholder="Describa el motivo, acuerdos de recuperación de clases o detalles relevantes..."
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Submit/Cancel */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting || getCheckedCoursesList().length === 0}
            >
              {submitting ? "Enviando..." : "Enviar Solicitudes"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
