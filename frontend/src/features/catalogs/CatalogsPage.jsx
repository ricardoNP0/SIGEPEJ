import { useState, useEffect } from "react";
import { apiClient } from "../../api/client.js";
import {
  BookOpen,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = useState("careers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [careers, setCareers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal states
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Form states
  const [careerForm, setCareerForm] = useState({ code: "", name: "", director: "" });
  const [subjectForm, setSubjectForm] = useState({ code: "", name: "", career: "", semester: 1 });
  const [courseForm, setCourseForm] = useState({
    code: "",
    subject: "",
    career: "",
    teacher: "",
    parallel: "G1",
    period: "2026-1",
    scheduleDays: [],
    scheduleDay: "lunes",
    scheduleStart: "08:00",
    scheduleEnd: "10:00",
    scheduleClassroom: "Lab 3"
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [careersData, subjectsData, coursesData, usersData] = await Promise.all([
        apiClient.getCareers(),
        apiClient.getSubjects(),
        apiClient.getCourses(),
        apiClient.getUsers()
      ]);
      setCareers(careersData);
      setSubjects(subjectsData);
      setCourses(coursesData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los catálogos académicos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCareer = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const created = await apiClient.createCareer(careerForm);
      setCareers(prev => [...prev, created]);
      setIsCareerModalOpen(false);
      setCareerForm({ code: "", name: "", director: "" });
      setSuccess("Carrera creada con éxito.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setFormError(err.message || "Error al crear la carrera.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const created = await apiClient.createSubject(subjectForm);
      setSubjects(prev => [...prev, created]);
      setIsSubjectModalOpen(false);
      setSubjectForm({ code: "", name: "", career: "", semester: 1 });
      setSuccess("Materia creada con éxito.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setFormError(err.message || "Error al crear la materia.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const schedule = [
      {
        day: courseForm.scheduleDay,
        startTime: courseForm.scheduleStart,
        endTime: courseForm.scheduleEnd,
        classroom: courseForm.scheduleClassroom
      }
    ];

    try {
      const created = await apiClient.createCourse({
        code: courseForm.code,
        subject: courseForm.subject,
        career: courseForm.career,
        teacher: courseForm.teacher,
        parallel: courseForm.parallel,
        period: courseForm.period,
        schedule
      });
      setCourses(prev => [...prev, created]);
      setIsCourseModalOpen(false);
      setCourseForm({
        code: "",
        subject: "",
        career: "",
        teacher: "",
        parallel: "G1",
        period: "2026-1",
        scheduleDays: [],
        scheduleDay: "lunes",
        scheduleStart: "08:00",
        scheduleEnd: "10:00",
        scheduleClassroom: "Lab 3"
      });
      setSuccess("Paralelo/Curso creado con éxito.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setFormError(err.message || "Error al crear el curso.");
    } finally {
      setSubmitting(false);
    }
  };

  const directors = users.filter(u => u.role === "director");
  const teachers = users.filter(u => u.role === "docente");

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Administración</span>
        <h1>Catálogos Académicos</h1>
        <p>
          Configure las estructuras de la institución: Carreras profesionales, materias del plan de estudios, y asignaciones de paralelos y docentes.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <BookOpen size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
        <button
          className={activeTab === "careers" ? "btn-primary" : "btn-secondary"}
          onClick={() => setActiveTab("careers")}
          style={{ minHeight: "38px" }}
        >
          Carreras
        </button>
        <button
          className={activeTab === "subjects" ? "btn-primary" : "btn-secondary"}
          onClick={() => setActiveTab("subjects")}
          style={{ minHeight: "38px" }}
        >
          Materias
        </button>
        <button
          className={activeTab === "courses" ? "btn-primary" : "btn-secondary"}
          onClick={() => setActiveTab("courses")}
          style={{ minHeight: "38px" }}
        >
          Paralelos y Cursos
        </button>
        <button
          onClick={loadData}
          className="btn-secondary"
          style={{ marginLeft: "auto", display: "inline-flex", gap: "6px", minHeight: "38px" }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-500)" }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
          <p>Cargando información del catálogo académico...</p>
        </div>
      ) : (
        <>
          {/* TAB CAREERS */}
          {activeTab === "careers" && (
            <div className="surface-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Catálogo</span>
                  <h2>Carreras Universitarias</h2>
                </div>
                <button
                  onClick={() => setIsCareerModalOpen(true)}
                  className="btn-primary"
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <Plus size={16} />
                  Crear Carrera
                </button>
              </div>

              {careers.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--ink-500)" }}>
                  Ninguna carrera registrada.
                </div>
              ) : (
                <div className="history-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre Carrera</th>
                        <th>Director Asignado</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careers.map(c => (
                        <tr key={c._id || c.id}>
                          <td><strong>{c.code}</strong></td>
                          <td>{c.name}</td>
                          <td>{c.director?.firstName ? `${c.director.firstName} ${c.director.lastName}` : c.director || "Sin director"}</td>
                          <td>
                            <span className="status-pill aprobada">Activa</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB SUBJECTS */}
          {activeTab === "subjects" && (
            <div className="surface-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Catálogo</span>
                  <h2>Materias de Plan de Estudios</h2>
                </div>
                <button
                  onClick={() => setIsSubjectModalOpen(true)}
                  className="btn-primary"
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <Plus size={16} />
                  Crear Materia
                </button>
              </div>

              {subjects.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--ink-500)" }}>
                  Ninguna materia registrada.
                </div>
              ) : (
                <div className="history-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre Materia</th>
                        <th>Carrera</th>
                        <th>Semestre</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map(s => (
                        <tr key={s._id || s.id}>
                          <td><strong>{s.code}</strong></td>
                          <td>{s.name}</td>
                          <td>{s.career?.name || s.career?.code || s.career || "Global"}</td>
                          <td>Semestre {s.semester}</td>
                          <td>
                            <span className="status-pill aprobada">Activa</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB COURSES */}
          {activeTab === "courses" && (
            <div className="surface-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Catálogo</span>
                  <h2>Asignaciones de Paralelos (Cursos)</h2>
                </div>
                <button
                  onClick={() => setIsCourseModalOpen(true)}
                  className="btn-primary"
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <Plus size={16} />
                  Crear Paralelo
                </button>
              </div>

              {courses.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--ink-500)" }}>
                  Ninguna asignación de curso registrada.
                </div>
              ) : (
                <div className="history-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Código Paralelo</th>
                        <th>Materia</th>
                        <th>Carrera</th>
                        <th>Docente</th>
                        <th>Paralelo</th>
                        <th>Horario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(co => (
                        <tr key={co._id || co.id}>
                          <td><strong>{co.code}</strong></td>
                          <td>
                            <div>{co.subject?.name}</div>
                            <span style={{ fontSize: "12px", color: "var(--ink-500)" }}>({co.subject?.code})</span>
                          </td>
                          <td>{co.career?.name || co.career?.code || co.career}</td>
                          <td>{co.teacher?.firstName ? `${co.teacher.firstName} ${co.teacher.lastName}` : co.teacher || "Sin asignar"}</td>
                          <td><span style={{ fontWeight: "700" }}>{co.parallel}</span> ({co.period})</td>
                          <td>
                            {co.schedule && co.schedule.map((sch, i) => (
                              <div key={i} style={{ fontSize: "12px" }}>
                                <span style={{ textTransform: "capitalize", fontWeight: "600" }}>{sch.day}:</span> {sch.startTime} - {sch.endTime} ({sch.classroom})
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* CREATE CAREER MODAL */}
      {isCareerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCareerModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Crear Carrera Académica</h2>
              <button onClick={() => setIsCareerModalOpen(false)} className="btn-icon-danger"><X size={20} /></button>
            </div>

            {formError && <div className="alert alert-error"><AlertCircle size={16} /><span>{formError}</span></div>}

            <form onSubmit={handleCreateCareer}>
              <div className="form-group">
                <label className="form-label" htmlFor="careerCode">Código de Carrera *</label>
                <input
                  id="careerCode"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. SIS"
                  value={careerForm.code}
                  onChange={(e) => setCareerForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="careerName">Nombre de Carrera *</label>
                <input
                  id="careerName"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. Ingeniería de Sistemas"
                  value={careerForm.name}
                  onChange={(e) => setCareerForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="careerDirector">Director de Carrera</label>
                <select
                  id="careerDirector"
                  className="form-select"
                  value={careerForm.director}
                  onChange={(e) => setCareerForm(prev => ({ ...prev, director: e.target.value }))}
                >
                  <option value="">Sin director asignado</option>
                  {directors.map(d => (
                    <option key={d._id || d.id} value={d._id || d.id}>{d.firstName} {d.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCareerModalOpen(false)} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting}>Crear Carrera</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubjectModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Crear Materia</h2>
              <button onClick={() => setIsSubjectModalOpen(false)} className="btn-icon-danger"><X size={20} /></button>
            </div>

            {formError && <div className="alert alert-error"><AlertCircle size={16} /><span>{formError}</span></div>}

            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label className="form-label" htmlFor="subCode">Código Materia *</label>
                <input
                  id="subCode"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. WEB3"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subName">Nombre Materia *</label>
                <input
                  id="subName"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. Programación Web III"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subCareer">Carrera *</label>
                <select
                  id="subCareer"
                  required
                  className="form-select"
                  value={subjectForm.career}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, career: e.target.value }))}
                >
                  <option value="">Seleccione una carrera...</option>
                  {careers.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subSemester">Semestre de Malla *</label>
                <input
                  id="subSemester"
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="form-input"
                  value={subjectForm.semester}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, semester: e.target.value }))}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsSubjectModalOpen(false)} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting}>Crear Materia</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCourseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 90vw)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Crear Paralelo / Asignación</h2>
              <button onClick={() => setIsCourseModalOpen(false)} className="btn-icon-danger"><X size={20} /></button>
            </div>

            {formError && <div className="alert alert-error"><AlertCircle size={16} /><span>{formError}</span></div>}

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label" htmlFor="coCode">Código Paralelo Único *</label>
                <input
                  id="coCode"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. WEB3-G1-2026-1"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="coSubject">Materia *</label>
                  <select
                    id="coSubject"
                    required
                    className="form-select"
                    value={courseForm.subject}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">Seleccione materia...</option>
                    {subjects.map(s => (
                      <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="coCareer">Carrera *</label>
                  <select
                    id="coCareer"
                    required
                    className="form-select"
                    value={courseForm.career}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, career: e.target.value }))}
                  >
                    <option value="">Seleccione carrera...</option>
                    {careers.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="coTeacher">Docente Asignado *</label>
                  <select
                    id="coTeacher"
                    required
                    className="form-select"
                    value={courseForm.teacher}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, teacher: e.target.value }))}
                  >
                    <option value="">Seleccione docente...</option>
                    {teachers.map(t => (
                      <option key={t._id || t.id} value={t._id || t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="coParallel">Paralelo *</label>
                    <input
                      id="coParallel"
                      type="text"
                      required
                      className="form-input"
                      placeholder="G1"
                      value={courseForm.parallel}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, parallel: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="coPeriod">Periodo *</label>
                    <input
                      id="coPeriod"
                      type="text"
                      required
                      className="form-input"
                      placeholder="2026-1"
                      value={courseForm.period}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, period: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Sub-form */}
              <div style={{ border: "1px solid var(--line)", padding: "12px", borderRadius: "8px", background: "var(--surface-muted)" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Horario de Clases</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Día</label>
                    <select
                      className="form-select"
                      value={courseForm.scheduleDay}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, scheduleDay: e.target.value }))}
                    >
                      <option value="lunes">Lunes</option>
                      <option value="martes">Martes</option>
                      <option value="miercoles">Miércoles</option>
                      <option value="jueves">Jueves</option>
                      <option value="viernes">Viernes</option>
                      <option value="sabado">Sábado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aula</label>
                    <input
                      type="text"
                      className="form-input"
                      value={courseForm.scheduleClassroom}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, scheduleClassroom: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hora Inicio</label>
                    <input
                      type="time"
                      className="form-input"
                      value={courseForm.scheduleStart}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, scheduleStart: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora Fin</label>
                    <input
                      type="time"
                      className="form-input"
                      value={courseForm.scheduleEnd}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, scheduleEnd: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: "14px" }}>
                <button type="button" className="btn-secondary" onClick={() => setIsCourseModalOpen(false)} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting}>Crear Paralelo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
