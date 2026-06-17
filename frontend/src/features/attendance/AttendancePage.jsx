import { useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Calendar, CheckCircle2, RefreshCw, Save } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";

function getCourseValue(course) {
  return course.id || course._id || course.code;
}

const DAY_BY_INDEX = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dateMatchesSchedule(dateValue, course) {
  if (!dateValue || !course?.schedule?.length) return true;
  const day = DAY_BY_INDEX[new Date(`${dateValue}T00:00:00`).getDay()];
  return course.schedule.some((item) => item.day === day);
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
      try {
        const data = await apiClient.getMyCourses(user.username, user.role);
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(getCourseValue(data[0]));
        }
      } catch (err) {
        setError(err.message || "No se pudieron cargar las materias.");
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [user]);

  async function loadAttendance() {
    if (!selectedCourse || !date) return;
    const course = courses.find((item) => getCourseValue(item) === selectedCourse);
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date(`${todayISO()}T00:00:00`);
    if (selectedDate > today) {
      setAttendance(null);
      setError("No se puede registrar asistencia para una fecha futura.");
      return;
    }
    if (!dateMatchesSchedule(date, course)) {
      setAttendance(null);
      setError("La fecha seleccionada no corresponde al horario registrado de la materia/paralelo.");
      return;
    }
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
    if (user?.role === "director") {
      const justification = window.prompt("Justificación obligatoria para modificar asistencia como Dirección:");
      if (!justification || justification.trim().length < 10) {
        setError("Dirección debe registrar una justificación de al menos 10 caracteres.");
        return;
      }

      setSubmitting(true);
      setMessage("");
      setError("");
      try {
        await apiClient.updateAttendanceByDirector(record.recordId, status, justification.trim());
        setAttendance((current) => ({
          ...current,
          records: current.records.map((item) =>
            item.recordId === record.recordId
              ? { ...item, status, lockedByRequest: status === "L", note: `MODIFICADO POR DIRECCIÓN: ${justification.trim()}` }
              : item
          ),
        }));
        setMessage("Asistencia modificada por Dirección.");
      } catch (err) {
        setError(err.message || "No se pudo modificar la asistencia.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

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
          Selecciona materia, paralelo y fecha. El docente puede marcar P/F; las licencias L aplicadas por Dirección quedan bloqueadas.
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
        </div>
      )}

      <section className="surface-panel">
        <div className="form-row">
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
              max={todayISO()}
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
                  <th>Código</th>
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
                      {record.lockedByRequest && <small className="muted-block">Bloqueado por Dirección</small>}
                    </td>
                    <td>
                      <div className="attendance-actions">
                        <button
                          className={`attendance-button ${record.status === "P" ? "active present" : ""}`}
                          type="button"
                          disabled={(record.lockedByRequest && user?.role !== "director") || submitting}
                          onClick={() => updateRecord(record, "P")}
                        >
                          P
                        </button>
                        <button
                          className={`attendance-button ${record.status === "F" ? "active absent" : ""}`}
                          type="button"
                          disabled={(record.lockedByRequest && user?.role !== "director") || submitting}
                          onClick={() => updateRecord(record, "F")}
                        >
                          F
                        </button>
                        <button
                          className={`attendance-button ${record.status === "L" ? "active leave" : ""}`}
                          type="button"
                          disabled={user?.role !== "director" || submitting}
                          onClick={() => updateRecord(record, "L")}
                          title={user?.role === "director" ? "Dirección puede aplicar L con justificación" : "La L solo se aplica por aprobación de Dirección"}
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


