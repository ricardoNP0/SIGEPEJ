<<<<<<< HEAD
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { AlertTriangle, CheckCircle2, Save, ArrowLeft, Calendar, BookOpen } from "lucide-react";

export default function AttendancePage() {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    async function loadCourses() {
=======
import { useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Calendar, CheckCircle2, RefreshCw, Save } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";

function getCourseValue(course) {
  return course.id || course._id || course.code;
}

export default function AttendancePage() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      if (!user) return;
      setLoadingCourses(true);
      setError("");
>>>>>>> main
      try {
        const data = await apiClient.getMyCourses(user.username, user.role);
        setCourses(data);
        if (data.length > 0) {
<<<<<<< HEAD
          setSelectedCourse(data[0].code);
        }
      } catch (err) {
        console.error("Error al cargar materias:", err);
        setErrorMsg("No se pudieron cargar las materias.");
=======
          setSelectedCourse(getCourseValue(data[0]));
        }
      } catch (err) {
        setError(err.message || "No se pudieron cargar las materias.");
>>>>>>> main
      } finally {
        setLoadingCourses(false);
      }
    }
<<<<<<< HEAD
    loadCourses();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse || !date) return;
    async function loadAttendance() {
      setLoadingAttendance(true);
      setErrorMsg("");
      try {
        const data = await apiClient.getAttendance(selectedCourse, date);
        setAttendance(data);
      } catch (err) {
        console.error("Error al cargar asistencia:", err);
        setErrorMsg("No se pudo cargar la lista de asistencia.");
        setAttendance(null);
      } finally {
        setLoadingAttendance(false);
      }
    }
    loadAttendance();
  }, [selectedCourse, date]);

  const handleStatusChange = async (studentId, newStatus) => {
    if (!attendance) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const record = attendance.records.find(r => r.student.id === studentId || r.student.code === studentId);
    if (record && record.lockedByRequest) {
      setErrorMsg("No se puede modificar un registro bloqueado por licencia.");
      setSubmitting(false);
      return;
    }

    try {
      await apiClient.updateAttendance(attendance._id, studentId, newStatus);
      setAttendance(prev => ({
        ...prev,
        records: prev.records.map(r =>
          (r.student.id === studentId || r.student.code === studentId)
            ? { ...r, status: newStatus }
            : r
        )
      }));
      setSuccessMsg("Asistencia actualizada correctamente.");
    } catch (err) {
      setErrorMsg(err.message || "Error al actualizar la asistencia.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAll = async () => {
    if (!attendance) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let allSuccess = true;
      for (const record of attendance.records) {
        if (record.lockedByRequest) continue;
        await apiClient.updateAttendance(attendance._id, record.student.id || record.student.code, record.status);
      }
      if (allSuccess) {
        setSuccessMsg("Toda la asistencia ha sido guardada correctamente.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Error al guardar la asistencia.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCourseObj = courses.find(c => c.code === selectedCourse);

  return (
    <section className="content-stack form-container">
      <div className="page-heading">
        <span className="eyebrow">Docente</span>
        <h1>Control de Asistencia</h1>
        <p>
          Seleccione la materia, paralelo y fecha para registrar la asistencia.
          Marque <strong>P</strong> (Presente) o <strong>F</strong> (Falta).
          Las licencias <strong>L</strong> aparecen bloqueadas si fueron aprobadas por Dirección.
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
=======

    loadCourses();
  }, [user]);

  async function loadAttendance() {
    if (!selectedCourse || !date) return;
    setLoadingAttendance(true);
    setError("");
    try {
      const data = await apiClient.getAttendance(selectedCourse, date);
      setAttendance(data);
    } catch (err) {
      setAttendance(null);
      setError(err.message || "No se pudo cargar la asistencia.");
    } finally {
      setLoadingAttendance(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, [selectedCourse, date]);

  const selectedCourseInfo = useMemo(
    () => courses.find((course) => getCourseValue(course) === selectedCourse),
    [courses, selectedCourse]
  );

  async function updateRecord(record, status) {
    if (record.lockedByRequest) {
      setError("No se puede modificar una licencia L aplicada por solicitud aprobada.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      await apiClient.updateAttendance(record.recordId, status);
      setAttendance((current) => ({
        ...current,
        records: current.records.map((item) =>
          item.recordId === record.recordId ? { ...item, status } : item
        ),
      }));
      setMessage("Asistencia actualizada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo actualizar la asistencia.");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveAll() {
    if (!attendance) return;
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      for (const record of attendance.records) {
        if (!record.lockedByRequest) {
          await apiClient.updateAttendance(record.recordId, record.status);
        }
      }
      setMessage("Lista de asistencia guardada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo guardar toda la asistencia.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="content-stack form-container wide-form">
      <div className="page-heading">
        <span className="eyebrow">Docente</span>
        <h1>Registro de asistencia</h1>
        <p>
          Selecciona materia, paralelo y fecha. El docente puede marcar P/F; las licencias L aplicadas por Direccion quedan bloqueadas.
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
          <AlertTriangle size={18} />
          <span>{error}</span>
>>>>>>> main
        </div>
      )}

      <section className="surface-panel">
        <div className="form-row">
<<<<<<< HEAD
          <div className="form-group">
            <label className="form-label" htmlFor="course">
              <BookOpen size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Materia y paralelo
            </label>
            {loadingCourses ? (
              <div style={{ padding: "10px", fontSize: "14px", color: "var(--ink-500)" }}>
                Cargando materias asignadas...
              </div>
            ) : (
              <select
                id="course"
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={submitting}
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

          <div className="form-group">
            <label className="form-label" htmlFor="date">
              <Calendar size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Fecha
            </label>
            <input
              id="date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>
      </section>

      {loadingAttendance && (
        <section className="surface-panel">
          <p style={{ textAlign: "center", color: "var(--ink-500)", padding: "20px" }}>
            Cargando lista de estudiantes...
          </p>
        </section>
      )}

      {!loadingAttendance && attendance && (
        <section className="surface-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">
                {selectedCourseObj ? `${selectedCourseObj.subjectName} - ${selectedCourseObj.parallel}` : selectedCourse}
              </span>
              <h2>Lista de estudiantes — {date}</h2>
            </div>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSaveAll}
              disabled={submitting}
              style={{ minHeight: "40px", padding: "8px 16px", fontSize: "13px" }}
            >
              <Save size={16} />
              {submitting ? "Guardando..." : "Guardar todo"}
            </button>
          </div>

          {attendance.records.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--ink-500)", padding: "20px" }}>
              No hay estudiantes inscritos en esta materia.
            </p>
          ) : (
            <div className="history-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Código</th>
                    <th>Estudiante</th>
                    <th style={{ width: "220px" }}>Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.records.map((record, index) => {
                    const student = record.student;
                    const isLocked = record.lockedByRequest;
                    return (
                      <tr key={student.id || student.code}>
                        <td style={{ color: "var(--ink-500)", fontWeight: 600 }}>{index + 1}</td>
                        <td style={{ color: "var(--ink-500)", fontSize: "13px" }}>
                          {student.code || student.id}
                        </td>
                        <td>
                          <strong>{student.firstName} {student.lastName}</strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                            <StatusButton
                              label="P"
                              active={record.status === "P"}
                              color="var(--success)"
                              bgColor="#dcfae6"
                              disabled={isLocked || submitting}
                              onClick={() => handleStatusChange(student.id || student.code, "P")}
                            />
                            <StatusButton
                              label="F"
                              active={record.status === "F"}
                              color="var(--danger)"
                              bgColor="#fee4e2"
                              disabled={isLocked || submitting}
                              onClick={() => handleStatusChange(student.id || student.code, "F")}
                            />
                            <StatusButton
                              label="L"
                              active={record.status === "L"}
                              color="var(--warning)"
                              bgColor="#fff3df"
                              disabled={isLocked || submitting}
                              onClick={() => handleStatusChange(student.id || student.code, "L")}
                              locked={isLocked}
                            />
                            {isLocked && (
                              <span
                                title="Bloqueado por licencia aprobada"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--ink-500)",
                                  fontStyle: "italic",
                                  marginLeft: "4px"
                                }}
                              >
                                Bloqueado por Dirección
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {!loadingAttendance && !attendance && selectedCourse && date && (
        <section className="surface-panel">
          <p style={{ textAlign: "center", color: "var(--ink-500)", padding: "20px" }}>
            Seleccione una materia y fecha para cargar la lista de estudiantes.
          </p>
        </section>
      )}
    </section>
  );
}

function StatusButton({ label, active, color, bgColor, disabled, onClick, locked }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={locked ? "Bloqueado por licencia aprobada" : `Marcar como ${label}`}
      style={{
        minWidth: "36px",
        height: "36px",
        border: active ? `2px solid ${color}` : "1px solid var(--line)",
        borderRadius: "6px",
        background: active ? bgColor : "var(--surface)",
        color: active ? color : "var(--ink-500)",
        fontWeight: active ? 800 : 600,
        fontSize: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: locked ? 0.5 : 1,
        transition: "all 120ms ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.target.style.borderColor = color;
          e.target.style.color = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.borderColor = "var(--line)";
          e.target.style.color = "var(--ink-500)";
        }
      }}
    >
      {label}
    </button>
  );
}
=======
          <label className="form-group">
            <span className="form-label">
              <BookOpen size={14} /> Materia y paralelo
            </span>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              disabled={loadingCourses || submitting}
            >
              {loadingCourses && <option>Cargando materias...</option>}
              {!loadingCourses && courses.length === 0 && <option value="">Sin materias asignadas</option>}
              {courses.map((course) => (
                <option value={getCourseValue(course)} key={getCourseValue(course)}>
                  {course.subjectName} - {course.parallel} ({course.code})
                </option>
              ))}
            </select>
          </label>

          <label className="form-group">
            <span className="form-label">
              <Calendar size={14} /> Fecha
            </span>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={submitting}
            />
          </label>
        </div>
      </section>

      <section className="surface-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              {selectedCourseInfo ? `${selectedCourseInfo.subjectName} - ${selectedCourseInfo.parallel}` : "Materia"}
            </span>
            <h2>Lista de estudiantes</h2>
          </div>
          <div className="row-actions">
            <button className="btn-secondary compact-button" type="button" onClick={loadAttendance} disabled={loadingAttendance}>
              <RefreshCw size={16} />
              Actualizar
            </button>
            <button className="btn-primary compact-button" type="button" onClick={saveAll} disabled={submitting || !attendance}>
              <Save size={16} />
              Guardar todo
            </button>
          </div>
        </div>

        {loadingAttendance ? (
          <p className="empty-state">Cargando estudiantes inscritos...</p>
        ) : !attendance || attendance.records.length === 0 ? (
          <p className="empty-state">No hay estudiantes inscritos para esta materia.</p>
        ) : (
          <div className="history-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Codigo</th>
                  <th>Estudiante</th>
                  <th>Estado</th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
                {attendance.records.map((record, index) => (
                  <tr key={record.recordId}>
                    <td>{index + 1}</td>
                    <td>{record.student.code || record.student.id}</td>
                    <td>
                      <strong>
                        {record.student.firstName} {record.student.lastName}
                      </strong>
                      {record.note && <small className="muted-block">{record.note}</small>}
                    </td>
                    <td>
                      <span className={`attendance-pill ${record.status}`}>
                        {record.status}
                      </span>
                      {record.lockedByRequest && <small className="muted-block">Bloqueado por Direccion</small>}
                    </td>
                    <td>
                      <div className="attendance-actions">
                        <button
                          className={`attendance-button ${record.status === "P" ? "active present" : ""}`}
                          type="button"
                          disabled={record.lockedByRequest || submitting}
                          onClick={() => updateRecord(record, "P")}
                        >
                          P
                        </button>
                        <button
                          className={`attendance-button ${record.status === "F" ? "active absent" : ""}`}
                          type="button"
                          disabled={record.lockedByRequest || submitting}
                          onClick={() => updateRecord(record, "F")}
                        >
                          F
                        </button>
                        <button
                          className={`attendance-button ${record.status === "L" ? "active leave" : ""}`}
                          type="button"
                          disabled
                          title="La L solo se aplica por aprobacion de Direccion"
                        >
                          L
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
>>>>>>> main
