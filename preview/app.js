const state = {
  role: null,
  view: "login",
  sidebarOpen: false,
  modal: null,
  attendanceCourse: "MAT-201-A",
  attendanceDate: "2026-06-04",
};

const roleInfo = {
  estudiante: {
    name: "Estudiante",
    user: "Daniel Escobar Pozo",
    caption: "Ingeniería de Sistemas - Grupo 2",
  },
  docente: {
    name: "Docente",
    user: "Fernando López Lis",
    caption: "Docente de Programación Web III",
  },
  director: {
    name: "Director de Carrera",
    user: "Christian Montaño Salvatierra",
    caption: "Aprobación y control académico",
  },
  secretario: {
    name: "Secretario Académico",
    user: "Josué Alejandro Rodríguez Vera",
    caption: "Registro, seguimiento y soporte",
  },
  administrador: {
    name: "Administrador",
    user: "Carlos Striker",
    caption: "Configuración general del sistema",
  },
};

const urlParams = new URLSearchParams(window.location.search);
if (roleInfo[urlParams.get("role")]) {
  state.role = urlParams.get("role");
  state.view = urlParams.get("view") || "dashboard";
}

const navByRole = {
  estudiante: [
    ["dashboard", "IN", "Inicio"],
    ["solicitud", "SO", "Nueva solicitud"],
    ["historial", "HI", "Historial"],
    ["notificaciones", "NO", "Notificaciones"],
  ],
  docente: [
    ["dashboard", "IN", "Inicio"],
    ["solicitud-docente", "SO", "Pedir ausencia"],
    ["asistencia", "AS", "Registrar asistencia"],
    ["notificaciones", "NO", "Notificaciones"],
  ],
  director: [
    ["dashboard", "IN", "Bandeja de revisión"],
    ["apelaciones", "AP", "Apelaciones"],
    ["auditoria", "AU", "Auditoría"],
    ["reportes", "RE", "Reportes"],
  ],
  secretario: [
    ["dashboard", "IN", "Panel de seguimiento"],
    ["auditoria", "AU", "Auditoría"],
    ["reportes", "RE", "Reportes"],
  ],
  administrador: [
    ["dashboard", "IN", "Administración"],
    ["catalogos", "CA", "Catálogos"],
    ["auditoria", "AU", "Auditoría"],
    ["reportes", "RE", "Reportes"],
  ],
};

const data = {
  students: [
    { id: "EST-2024-114", name: "Daniel Escobar Pozo", email: "daniel.escobar@univalle.edu", career: "Ingeniería de Sistemas" },
    { id: "EST-2024-118", name: "Núñez del Prado", email: "nunez.prado@univalle.edu", career: "Ingeniería de Sistemas" },
    { id: "EST-2024-129", name: "José Alejandro Rodríguez Vera", email: "josue.rodriguez@univalle.edu", career: "Ingeniería de Sistemas" },
    { id: "EST-2024-132", name: "Carlos Striker", email: "carlos.striker@univalle.edu", career: "Ingeniería de Sistemas" },
  ],
  teachers: [
    { id: "DOC-041", name: "Fernando López Lis", email: "fernando.lopez@univalle.edu" },
    { id: "DOC-055", name: "Ana María Vargas", email: "ana.vargas@univalle.edu" },
  ],
  courses: [
    { id: "WEB3-A", name: "Programación Web III", career: "Ingeniería de Sistemas", parallel: "Grupo 2", teacher: "Fernando López Lis", schedule: "Lunes y miércoles 18:30-20:00" },
    { id: "BD2-B", name: "Base de Datos II", career: "Ingeniería de Sistemas", parallel: "Grupo 1", teacher: "Ana María Vargas", schedule: "Martes 19:00-21:00" },
    { id: "MAT-201-A", name: "Matemática Discreta", career: "Ingeniería de Sistemas", parallel: "Grupo 2", teacher: "Fernando López Lis", schedule: "Jueves 07:30-09:00" },
  ],
  motives: [
    { id: "salud", name: "Salud", evidence: true },
    { id: "tramite", name: "Trámite institucional", evidence: true },
    { id: "laboral", name: "Motivo laboral", evidence: true },
    { id: "familiar", name: "Emergencia familiar", evidence: false },
    { id: "docente", name: "Actividad docente institucional", evidence: true },
  ],
  requests: [
    {
      id: "SOL-0007",
      actor: "estudiante",
      person: "Daniel Escobar Pozo",
      code: "EST-2024-114",
      type: "Ausencia estudiantil",
      status: "Aprobada",
      motive: "Salud",
      mode: "Justificación posterior",
      dates: ["2026-05-28"],
      courses: ["Programación Web III"],
      evidence: "certificado_medico.pdf",
      summary: "Falta ya registrada; se cambió de F a L al aprobar.",
      reviewer: "Christian Montaño Salvatierra",
      comment: "Documento válido. Se autoriza licencia académica.",
      createdAt: "2026-05-29 08:12",
      updatedAt: "2026-05-29 10:40",
      appeal: false,
    },
    {
      id: "SOL-0011",
      actor: "estudiante",
      person: "Daniel Escobar Pozo",
      code: "EST-2024-114",
      type: "Ausencia estudiantil",
      status: "Observada",
      motive: "Trámite institucional",
      mode: "Permiso anticipado",
      dates: ["2026-06-05"],
      courses: ["Base de Datos II"],
      evidence: "constancia_en_tramite.pdf",
      summary: "Falta sello del área que emitió la constancia.",
      reviewer: "Christian Montaño Salvatierra",
      comment: "Adjuntar documento firmado o sellado para continuar.",
      createdAt: "2026-06-01 16:30",
      updatedAt: "2026-06-02 09:10",
      appeal: false,
    },
    {
      id: "SOL-0012",
      actor: "docente",
      person: "Fernando López Lis",
      code: "DOC-041",
      type: "Ausencia docente",
      status: "Pendiente",
      motive: "Actividad docente institucional",
      mode: "Permiso anticipado",
      dates: ["2026-06-04", "2026-06-06", "2026-06-10"],
      courses: ["Programación Web III", "Matemática Discreta"],
      evidence: "invitacion_evento_academico.pdf",
      summary: "Ausencia no consecutiva en más de una materia.",
      reviewer: "Pendiente",
      comment: "Sin revisión todavía.",
      createdAt: "2026-06-02 14:05",
      updatedAt: "2026-06-02 14:05",
      appeal: false,
    },
    {
      id: "SOL-0013",
      actor: "estudiante",
      person: "Núñez del Prado",
      code: "EST-2024-118",
      type: "Ausencia estudiantil",
      status: "Pendiente",
      motive: "Emergencia familiar",
      mode: "Permiso anticipado",
      dates: ["2026-06-07", "2026-06-08"],
      courses: ["Programación Web III", "Base de Datos II"],
      evidence: "No obligatorio",
      summary: "Solicita licencia para dos días por emergencia familiar.",
      reviewer: "Pendiente",
      comment: "Sin revisión todavía.",
      createdAt: "2026-06-03 09:25",
      updatedAt: "2026-06-03 09:25",
      appeal: false,
    },
    {
      id: "SOL-0009",
      actor: "estudiante",
      person: "José Alejandro Rodríguez Vera",
      code: "EST-2024-129",
      type: "Ausencia estudiantil",
      status: "Rechazada",
      motive: "Motivo laboral",
      mode: "Justificación posterior",
      dates: ["2026-05-25"],
      courses: ["Matemática Discreta"],
      evidence: "captura_turno.jpg",
      summary: "Documento insuficiente para validar la ausencia.",
      reviewer: "Christian Montaño Salvatierra",
      comment: "La evidencia no confirma horario ni responsable.",
      createdAt: "2026-05-26 11:10",
      updatedAt: "2026-05-27 08:30",
      appeal: true,
    },
  ],
  notifications: [
    { id: 1, to: "estudiante", title: "Solicitud observada", text: "SOL-0011 requiere corrección de documento.", date: "2026-06-02 09:10", unread: true },
    { id: 2, to: "estudiante", title: "Licencia aprobada", text: "SOL-0007 cambió asistencia de F a L.", date: "2026-05-29 10:41", unread: false },
    { id: 3, to: "docente", title: "Solicitud enviada", text: "SOL-0012 está pendiente de revisión.", date: "2026-06-02 14:05", unread: true },
    { id: 4, to: "director", title: "Nueva solicitud docente", text: "Fernando López Lis solicitó ausencia en varias fechas.", date: "2026-06-02 14:05", unread: true },
    { id: 5, to: "secretario", title: "Documento observado", text: "Registrar soporte recibido para SOL-0011 si llega físicamente.", date: "2026-06-02 09:15", unread: false },
  ],
  attendance: [
    { courseId: "MAT-201-A", date: "2026-06-04", student: "Daniel Escobar Pozo", code: "EST-2024-114", state: "P", locked: false, note: "Editable por docente" },
    { courseId: "MAT-201-A", date: "2026-06-04", student: "Núñez del Prado", code: "EST-2024-118", state: "F", locked: false, note: "Editable por docente" },
    { courseId: "MAT-201-A", date: "2026-06-04", student: "José Alejandro Rodríguez Vera", code: "EST-2024-129", state: "L", locked: true, note: "Licencia aprobada por Dirección" },
    { courseId: "MAT-201-A", date: "2026-06-04", student: "Carlos Striker", code: "EST-2024-132", state: "P", locked: false, note: "Editable por docente" },
    { courseId: "WEB3-A", date: "2026-05-28", student: "Daniel Escobar Pozo", code: "EST-2024-114", state: "L", locked: true, note: "F -> L por SOL-0007" },
    { courseId: "WEB3-A", date: "2026-06-07", student: "Núñez del Prado", code: "EST-2024-118", state: "F", locked: false, note: "Pendiente de revisión SOL-0013" },
  ],
  audit: [
    { id: "AUD-1001", date: "2026-05-29 10:40", user: "Christian Montaño Salvatierra", role: "Director", action: "Aprobó SOL-0007", before: "Pendiente / F", after: "Aprobada / L", note: "Cambio automático de asistencia con transacción." },
    { id: "AUD-1002", date: "2026-06-02 09:10", user: "Christian Montaño Salvatierra", role: "Director", action: "Observó SOL-0011", before: "Pendiente", after: "Observada", note: "Documento sin sello institucional." },
    { id: "AUD-1003", date: "2026-06-03 09:25", user: "Núñez del Prado", role: "Estudiante", action: "Creó SOL-0013", before: "No existía", after: "Pendiente", note: "Solicitud para dos fechas y dos materias." },
  ],
};

function statusClass(status) {
  const s = status.toLowerCase();
  if (s.includes("aprob") || s === "p") return "approved";
  if (s.includes("rechaz") || s === "f") return "rejected";
  if (s.includes("observ") || s === "l") return "observed";
  if (s.includes("cerr")) return "closed";
  return "pending";
}

function stateText(value) {
  return { P: "Presente", F: "Falta", L: "Licencia" }[value] || value;
}

function nowLabel() {
  return new Date().toLocaleString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setRole(role) {
  state.role = role;
  state.view = "dashboard";
  state.sidebarOpen = false;
  render();
}

function setView(view) {
  state.view = view;
  state.sidebarOpen = false;
  render();
}

function logout() {
  state.role = null;
  state.view = "login";
  state.modal = null;
  render();
}

function appShell(content) {
  const info = roleInfo[state.role];
  const nav = navByRole[state.role]
    .map(([view, icon, label]) => `
      <button class="nav-btn ${state.view === view ? "active" : ""}" data-view="${view}">
        <span class="nav-icon">${icon}</span>
        <span>${label}</span>
      </button>
    `)
    .join("");

  return `
    <div class="shell">
      <aside class="sidebar ${state.sidebarOpen ? "open" : ""}" aria-label="Navegación principal">
        <div class="brand-line">
          <div class="brand-mark">UV</div>
          <div>
            <strong>SIGEPEJ</strong>
            <span>Control de ausencias</span>
          </div>
        </div>
        <div class="role-badge">
          <small>Sesión activa</small>
          <strong>${info.user}</strong>
          <small>${info.name}</small>
        </div>
        <nav class="nav-list">${nav}</nav>
      </aside>
      <div class="content">
        <header class="topbar">
          <button class="icon-btn mobile-menu" data-action="toggle-sidebar" aria-label="Abrir menú">≡</button>
          <div class="topbar-title">
            <strong>${info.name}</strong>
            <span>${info.caption}</span>
          </div>
          <div class="topbar-actions">
            <span class="tag gold">Base simulada SIGEPEJ</span>
            <button class="btn btn-outline" data-action="logout">Cerrar sesión</button>
          </div>
        </header>
        <main id="main" class="main">${content}</main>
      </div>
    </div>
    ${state.modal ? renderModal() : ""}
  `;
}

function loginView() {
  const roles = Object.entries(roleInfo)
    .map(([key, info]) => `
      <button class="role-btn" data-login="${key}">
        <span>
          <strong>${info.name}</strong>
          <span>${info.user}</span>
        </span>
        <span class="tag">Entrar</span>
      </button>
    `)
    .join("");

  return `
    <section class="login-page">
      <div class="login-hero">
        <div class="brand-line">
          <div class="brand-mark">UV</div>
          <div>
            <strong>SIGEPEJ</strong>
            <span>Sistema de Gestión de Solicitudes de Ausencia</span>
          </div>
        </div>
        <div class="login-title">
          <h1>Solicitudes de ausencia y asistencia en un solo flujo.</h1>
          <p>Prototipo académico para reemplazar formularios manuales, evidencias engrampadas y revisiones presenciales por un seguimiento formal con roles, estados, auditoría y control de asistencia.</p>
        </div>
        <div class="login-proof">
          <div class="proof-item"><strong>P/F/L</strong><span>Asistencia con licencia bloqueada</span></div>
          <div class="proof-item"><strong>Auditoría</strong><span>Fecha, hora, usuario, acción y evidencia</span></div>
          <div class="proof-item"><strong>Transacción</strong><span>Aprobación sin cambios parciales</span></div>
        </div>
      </div>
      <div class="login-panel">
        <div class="login-card">
          <h2>Acceso al prototipo</h2>
          <p>Elige un rol para revisar sus pantallas y el flujo del sistema con datos estáticos.</p>
          <div class="role-grid">${roles}</div>
        </div>
      </div>
    </section>
  `;
}

function dashboardByRole() {
  if (state.role === "estudiante") return studentDashboard();
  if (state.role === "docente") return teacherDashboard();
  if (state.role === "director") return directorDashboard();
  if (state.role === "secretario") return secretaryDashboard();
  return adminDashboard();
}

function studentDashboard() {
  const mine = data.requests.filter((r) => r.code === "EST-2024-114");
  return section(
    "Panel del estudiante",
    "El estudiante crea solicitudes, corrige observaciones, consulta respuestas y puede apelar rechazos.",
    `<button class="btn btn-primary" data-view="solicitud">Nueva solicitud</button>`,
    `
    <div class="grid grid-4">
      ${metric("Solicitudes", mine.length, "Historial personal", "blue")}
      ${metric("Aprobadas", mine.filter((r) => r.status === "Aprobada").length, "Impactan asistencia", "green")}
      ${metric("Observadas", mine.filter((r) => r.status === "Observada").length, "Requieren corrección", "gold")}
      ${metric("Notificaciones", data.notifications.filter((n) => n.to === "estudiante" && n.unread).length, "Sin leer", "red")}
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-header"><h2>Estado de asistencia reciente</h2></div>
        <div class="panel-body">${calendarStrip()}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Últimas solicitudes</h2></div>
        <div class="panel-body">${requestsTable(mine, false)}</div>
      </div>
    </div>
    `
  );
}

function teacherDashboard() {
  const teacherReq = data.requests.filter((r) => r.actor === "docente");
  return section(
    "Panel del docente",
    "El docente puede solicitar ausencia para una o varias materias y registrar asistencia; las licencias aprobadas por Dirección quedan bloqueadas.",
    `<button class="btn btn-primary" data-view="asistencia">Registrar asistencia</button>`,
    `
    <div class="grid grid-4">
      ${metric("Materias", 2, "Asignadas al docente", "blue")}
      ${metric("Solicitudes", teacherReq.length, "Ausencias docentes", "gold")}
      ${metric("Pendientes", teacherReq.filter((r) => r.status === "Pendiente").length, "En revisión", "red")}
      ${metric("Licencias bloqueadas", data.attendance.filter((a) => a.locked).length, "No editables", "green")}
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-header"><h2>Materias del docente</h2></div>
        <div class="panel-body">${coursesTable(data.courses.filter((c) => c.teacher === "Fernando López Lis"))}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Solicitudes docentes</h2></div>
        <div class="panel-body">${requestsTable(teacherReq, false)}</div>
      </div>
    </div>
    `
  );
}

function directorDashboard() {
  const pending = data.requests.filter((r) => ["Pendiente", "Observada"].includes(r.status));
  return section(
    "Bandeja de revisión",
    "El Director de Carrera revisa solicitudes, decide el estado y genera el impacto automático en asistencia con registro de auditoría.",
    `<button class="btn btn-outline" data-view="auditoria">Ver auditoría</button>`,
    `
    <div class="grid grid-4">
      ${metric("Pendientes", data.requests.filter((r) => r.status === "Pendiente").length, "Requieren decisión", "red")}
      ${metric("Observadas", data.requests.filter((r) => r.status === "Observada").length, "Esperan corrección", "gold")}
      ${metric("Aprobadas", data.requests.filter((r) => r.status === "Aprobada").length, "Con impacto aplicado", "green")}
      ${metric("Apelaciones", data.requests.filter((r) => r.appeal).length, "Revisión adicional", "blue")}
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Solicitudes para revisar</h2></div>
      <div class="panel-body">${requestsTable(pending, true)}</div>
    </div>
    `
  );
}

function secretaryDashboard() {
  return section(
    "Panel de seguimiento académico",
    "Secretaría consulta estados, ayuda a registrar soporte documental y prepara reportes para carrera, materia o estado.",
    `<button class="btn btn-primary" data-view="reportes">Ver reportes</button>`,
    `
    <div class="grid grid-4">
      ${metric("Total", data.requests.length, "Solicitudes registradas", "blue")}
      ${metric("Documentos", data.requests.filter((r) => r.evidence && r.evidence !== "No obligatorio").length, "Adjuntados", "green")}
      ${metric("Observadas", data.requests.filter((r) => r.status === "Observada").length, "Seguimiento", "gold")}
      ${metric("Auditoría", data.audit.length, "Eventos críticos", "red")}
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-header"><h2>Solicitudes recientes</h2></div>
        <div class="panel-body">${requestsTable(data.requests.slice(0, 5), false)}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Tareas de soporte</h2></div>
        <div class="panel-body">
          ${alertBox("Validar documento observado", "SOL-0011 necesita constancia firmada o sellada.")}
          ${alertBox("Preparar reporte semanal", "Filtrar solicitudes por carrera y materia para Dirección.")}
          ${alertBox("Confirmar datos de inscripción", "La lista de estudiantes inscritos se consume desde API simulada.")}
        </div>
      </div>
    </div>
    `
  );
}

function adminDashboard() {
  return section(
    "Administración del sistema",
    "Pantalla para mantener usuarios, roles, materias, motivos, reglas de evidencia y parámetros de integración simulada.",
    `<button class="btn btn-primary" data-view="catalogos">Configurar catálogos</button>`,
    `
    <div class="grid grid-4">
      ${metric("Usuarios", data.students.length + data.teachers.length + 3, "Roles activos", "blue")}
      ${metric("Materias", data.courses.length, "API académica simulada", "green")}
      ${metric("Motivos", data.motives.length, "Reglas de evidencia", "gold")}
      ${metric("Estados", 4, "Pendiente, observado, aprobado, rechazado", "red")}
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <div class="panel">
        <div class="panel-header"><h2>Integraciones simuladas</h2></div>
        <div class="panel-body">
          ${alertBox("API de estudiantes", "Busca por correo o código y devuelve carrera, datos personales y materias inscritas.")}
          ${alertBox("API de inscripción", "Devuelve estudiantes inscritos por materia, paralelo y docente.")}
          ${alertBox("API de asistencia", "Recibe P, F o L; bloquea L si viene de Dirección.")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Reglas críticas</h2></div>
        <div class="panel-body">
          ${ruleList()}
        </div>
      </div>
    </div>
    `
  );
}

function requestForm(actor) {
  const isTeacher = actor === "docente";
  const person = isTeacher ? roleInfo.docente.user : roleInfo.estudiante.user;
  const courses = isTeacher
    ? data.courses.filter((c) => c.teacher === "Fernando López Lis")
    : data.courses;
  return section(
    isTeacher ? "Solicitud de ausencia docente" : "Solicitud de ausencia estudiantil",
    isTeacher
      ? "El docente puede pedir ausencia para una clase, varias materias o fechas no consecutivas. Si se aprueba, los estudiantes afectados quedan presentes automáticamente."
      : "Un solo formulario cubre permisos anticipados y justificaciones posteriores. La diferencia se determina por la fecha seleccionada.",
    "",
    `
    <div class="grid grid-2">
      <div class="panel">
        <div class="panel-header"><h2>Datos de la solicitud</h2></div>
        <div class="panel-body">
          <form class="form" data-form="${isTeacher ? "teacher-request" : "student-request"}">
            <div class="grid grid-2">
              <div class="field">
                <label for="person">Solicitante</label>
                <input id="person" value="${person}" readonly>
                <small>Dato obtenido desde la API académica simulada.</small>
              </div>
              <div class="field">
                <label for="mode">Tipo calculado</label>
                <select id="mode" name="mode">
                  <option>Permiso anticipado</option>
                  <option>Justificación posterior</option>
                </select>
                <small>Anticipado si la fecha es futura; posterior si ya faltó.</small>
              </div>
            </div>
            <div class="grid grid-2">
              <div class="field">
                <label for="dates">Fechas afectadas</label>
                <input id="dates" name="dates" value="${isTeacher ? "2026-06-04, 2026-06-06, 2026-06-10" : "2026-06-07, 2026-06-08"}">
                <small>Permite una fecha, rango o fechas no consecutivas separadas por coma.</small>
              </div>
              <div class="field">
                <label for="motive">Motivo</label>
                <select id="motive" name="motive">
                  ${data.motives.map((m) => `<option value="${m.name}">${m.name}${m.evidence ? " - requiere evidencia" : ""}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="field">
              <label>Materias afectadas</label>
              <div class="checkbox-list">
                ${courses.map((course, index) => `
                  <label class="check-row">
                    <input type="checkbox" name="courses" value="${course.name}" ${index === 0 || isTeacher ? "checked" : ""}>
                    <span>${course.name} - ${course.parallel} - ${course.schedule}</span>
                  </label>
                `).join("")}
              </div>
            </div>
            <div class="field">
              <label for="evidence">Documento de respaldo</label>
              <input id="evidence" name="evidence" type="file">
              <small>En este mockup no se sube archivo real; se registra un nombre simulado.</small>
            </div>
            <div class="field">
              <label for="summary">Detalle de la ausencia</label>
              <textarea id="summary" name="summary">${isTeacher ? "Solicito licencia por participación en actividad académica institucional. Afecta varias fechas no consecutivas." : "Solicito ausencia por emergencia familiar. Quedo atento a revisión de Dirección."}</textarea>
            </div>
            <div class="toolbar">
              <button type="submit" class="btn btn-primary">Enviar solicitud</button>
              <button type="button" class="btn btn-outline" data-view="dashboard">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Reglas aplicadas</h2></div>
        <div class="panel-body">
          ${alertBox("Fechas", isTeacher ? "Una solicitud docente puede cubrir varias materias y fechas no consecutivas." : "No se pide permiso para fecha pasada; si ya pasó, queda como justificación posterior.")}
          ${alertBox("Evidencia", "Salud, trámite, laboral y actividad institucional exigen documento. Emergencia familiar puede revisarse sin evidencia obligatoria.")}
          ${alertBox("Impacto", isTeacher ? "Al aprobar ausencia docente, la clase queda autorizada y los estudiantes se marcan como P automáticamente." : "Al aprobar, si ya existía F se cambia a L; si es futuro, se agenda L.")}
          ${alertBox("Auditoría", "Cada envío, observación, aprobación, rechazo o apelación genera un registro con fecha, hora, usuario y comentario.")}
        </div>
      </div>
    </div>
    `
  );
}

function historyView() {
  const mine = data.requests.filter((r) => r.code === "EST-2024-114");
  return section(
    "Historial del estudiante",
    "Consulta todas las solicitudes, respuestas, evidencias y posibilidad de apelación cuando corresponde.",
    `<button class="btn btn-primary" data-view="solicitud">Nueva solicitud</button>`,
    `<div class="panel"><div class="panel-body">${requestsTable(mine, false, true)}</div></div>`
  );
}

function notificationsView() {
  const notes = data.notifications.filter((n) => n.to === state.role);
  return section(
    "Notificaciones",
    "Respuestas de solicitudes, observaciones, alertas pendientes y mensajes generados por el flujo del sistema.",
    "",
    `
    <div class="grid">
      ${notes.length ? notes.map((n) => `
        <div class="alert">
          <div class="toolbar">
            <div>
              <strong>${n.title}</strong>
              <p>${n.text}</p>
              <p class="muted">${n.date}</p>
            </div>
            <span class="status ${n.unread ? "pending" : "closed"}">${n.unread ? "No leída" : "Leída"}</span>
          </div>
        </div>
      `).join("") : `<div class="empty-state">No hay notificaciones para este rol.</div>`}
    </div>
    `
  );
}

function attendanceView() {
  const courseOptions = data.courses
    .filter((c) => c.teacher === "Fernando López Lis")
    .map((c) => `<option value="${c.id}" ${state.attendanceCourse === c.id ? "selected" : ""}>${c.name} - ${c.parallel}</option>`)
    .join("");
  const rows = data.attendance.filter((a) => a.courseId === state.attendanceCourse && a.date === state.attendanceDate);
  const course = data.courses.find((c) => c.id === state.attendanceCourse);

  return section(
    "Registro de asistencia",
    "El docente marca P o F. Las licencias L aprobadas por Dirección se muestran bloqueadas y no pueden ser modificadas por el docente.",
    "",
    `
    <div class="panel">
      <div class="panel-body">
        <div class="toolbar">
          <div class="filters">
            <div class="field">
              <label for="attendance-course">Materia y paralelo</label>
              <select id="attendance-course" data-action="change-course">${courseOptions}</select>
            </div>
            <div class="field">
              <label for="attendance-date">Fecha</label>
              <input id="attendance-date" type="date" value="${state.attendanceDate}" data-action="change-date">
            </div>
          </div>
          <span class="tag gold">${course ? course.schedule : "Horario"}</span>
        </div>
        <div class="attendance-grid">
          ${rows.length ? rows.map((row) => attendanceRow(row)).join("") : `<div class="empty-state">No hay estudiantes cargados para esta fecha. La API simulada de inscripción devolvería la lista.</div>`}
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Lectura del docente</h2></div>
      <div class="panel-body">
        ${alertBox("P", "Presente: editable por el docente durante el registro de clase.")}
        ${alertBox("F", "Falta: editable por el docente durante el registro de clase. Si Dirección aprueba una justificación posterior, cambia a L.")}
        ${alertBox("L", "Licencia: estado autorizado por Dirección. El docente solo lo visualiza; no puede cambiarlo.")}
      </div>
    </div>
    `
  );
}

function attendanceRow(row) {
  const states = ["P", "F", "L"].map((value) => {
    const active = row.state === value ? `active-${value.toLowerCase()}` : "";
    const locked = row.locked && value !== row.state ? "locked" : "";
    const disabled = row.locked ? "disabled" : "";
    return `<button class="state-btn ${active} ${locked}" data-action="mark-attendance" data-code="${row.code}" data-state="${value}" ${disabled}>${value}</button>`;
  }).join("");
  return `
    <div class="attendance-row">
      <div class="attendance-name">
        <strong>${row.student}</strong>
        <span>${row.code}</span>
      </div>
      ${states}
      <span class="tag ${row.locked ? "gold" : "gray"}">${row.locked ? "Bloqueado por Dirección" : row.note}</span>
    </div>
  `;
}

function appealsView() {
  const appeals = data.requests.filter((r) => r.appeal || r.status === "Rechazada");
  return section(
    "Apelaciones",
    "El usuario puede responder a una decisión rechazada. Dirección revisa la apelación y registra una nueva decisión auditada.",
    "",
    `<div class="panel"><div class="panel-body">${requestsTable(appeals, true)}</div></div>`
  );
}

function auditView() {
  return section(
    "Auditoría del sistema",
    "Registro de acciones importantes para demostrar quién cambió qué, cuándo, desde qué estado y con qué justificación.",
    "",
    `
    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Fecha y hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Antes</th><th>Después</th><th>Nota</th></tr></thead>
            <tbody>
              ${data.audit.map((a) => `
                <tr>
                  <td>${a.id}</td>
                  <td>${a.date}</td>
                  <td>${a.user}</td>
                  <td>${a.role}</td>
                  <td>${a.action}</td>
                  <td>${a.before}</td>
                  <td>${a.after}</td>
                  <td>${a.note}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `
  );
}

function reportsView() {
  const byStatus = ["Pendiente", "Observada", "Aprobada", "Rechazada"].map((status) => ({
    label: status,
    value: data.requests.filter((r) => r.status === status).length,
  }));
  const max = Math.max(...byStatus.map((x) => x.value), 1);
  return section(
    "Reportes",
    "Reportes para exposición: por estado, materia, carrera, tipo de solicitante e impacto en asistencia.",
    `<button class="btn btn-outline" data-action="fake-export">Exportar PDF simulado</button>`,
    `
    <div class="grid grid-2">
      <div class="panel">
        <div class="panel-header"><h2>Solicitudes por estado</h2></div>
        <div class="panel-body">
          <div class="chart-bars">
            ${byStatus.map((item) => `
              <div class="bar-row">
                <strong>${item.label}</strong>
                <div class="bar-track"><div class="bar-fill" style="width:${(item.value / max) * 100}%"></div></div>
                <span>${item.value}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Materias con más solicitudes</h2></div>
        <div class="panel-body">
          ${coursesTable(data.courses)}
        </div>
      </div>
    </div>
    <div class="grid grid-3" style="margin-top:16px">
      ${metric("Estudiantiles", data.requests.filter((r) => r.actor === "estudiante").length, "Solicitudes de estudiantes", "blue")}
      ${metric("Docentes", data.requests.filter((r) => r.actor === "docente").length, "Solicitudes de docentes", "gold")}
      ${metric("Licencias en asistencia", data.attendance.filter((a) => a.state === "L").length, "Estados L registrados", "green")}
    </div>
    `
  );
}

function catalogView() {
  return section(
    "Catálogos y configuración",
    "Administración de datos base que el proyecto consumiría desde APIs o base MongoDB Atlas.",
    "",
    `
    <div class="grid grid-2">
      <div class="panel">
        <div class="panel-header"><h2>Motivos y evidencia</h2></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Motivo</th><th>Documento</th><th>Regla</th></tr></thead>
              <tbody>
                ${data.motives.map((m) => `
                  <tr>
                    <td>${m.name}</td>
                    <td><span class="status ${m.evidence ? "approved" : "pending"}">${m.evidence ? "Obligatorio" : "Opcional"}</span></td>
                    <td>${m.evidence ? "No permite enviar sin respaldo" : "Permite revisión sin documento"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h2>Usuarios simulados</h2></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Código</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
              <tbody>
                ${data.students.map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.email}</td><td>Estudiante</td></tr>`).join("")}
                ${data.teachers.map((t) => `<tr><td>${t.id}</td><td>${t.name}</td><td>${t.email}</td><td>Docente</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    `
  );
}

function requestDetail(req) {
  const mode = state.modal?.mode || "view";
  const canReview = mode === "review" && ["director", "secretario"].includes(state.role);
  const canAppeal = mode === "appeal" && state.role === "estudiante" && req.status === "Rechazada";
  if (mode === "view") {
    return `
      <div class="detail-list">
        ${detailBox("Código", req.id)}
        ${detailBox("Estado", `<span class="status ${statusClass(req.status)}">${req.status}</span>`)}
        ${detailBox("Solicitante", `${req.person} (${req.code})`)}
        ${detailBox("Tipo", req.type)}
        ${detailBox("Modalidad", req.mode)}
        ${detailBox("Fechas", req.dates.join(", "))}
        ${detailBox("Materias", req.courses.join(", "))}
      </div>
      <div class="panel" style="margin-top:16px">
        <div class="panel-header"><h2>Resumen de solicitud</h2></div>
        <div class="panel-body">
          <p>${req.summary}</p>
          <p class="muted"><strong>Comentario registrado:</strong> ${req.comment}</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="detail-list">
      ${detailBox("Código", req.id)}
      ${detailBox("Estado", `<span class="status ${statusClass(req.status)}">${req.status}</span>`)}
      ${detailBox("Solicitante", `${req.person} (${req.code})`)}
      ${detailBox("Tipo", req.type)}
      ${detailBox("Modalidad", req.mode)}
      ${detailBox("Motivo", req.motive)}
      ${detailBox("Fechas", req.dates.join(", "))}
      ${detailBox("Materias", req.courses.join(", "))}
      ${detailBox("Evidencia", req.evidence)}
      ${detailBox("Revisor", req.reviewer)}
    </div>
    ${evidenceReviewBox(req)}
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Detalle y comentario</h2></div>
      <div class="panel-body">
        <p>${req.summary}</p>
        <p class="muted"><strong>Comentario de revisión:</strong> ${req.comment}</p>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Flujo automático</h2></div>
      <div class="panel-body">
        <div class="timeline">
          <div class="timeline-item"><strong>1. Validación</strong><span>Se revisan fechas, materias, motivo y evidencia obligatoria.</span></div>
          <div class="timeline-item"><strong>2. Decisión del Director</strong><span>Aprobar, observar o rechazar requiere comentario.</span></div>
          <div class="timeline-item"><strong>3. Transacción</strong><span>Solicitud, asistencia, auditoría y notificación se guardan juntas.</span></div>
          <div class="timeline-item"><strong>4. Impacto</strong><span>${req.actor === "docente" ? "La clase queda autorizada y estudiantes quedan P automático." : "Asistencia pasa de F a L o se agenda L futura."}</span></div>
        </div>
      </div>
    </div>
    ${canReview ? reviewForm(req) : ""}
    ${canAppeal ? appealForm(req) : ""}
  `;
}

function evidenceReviewBox(req) {
  const motive = data.motives.find((m) => m.name === req.motive);
  const evidenceStatus = motive?.evidence ? "Obligatoria" : "No obligatoria";
  return `
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Evidencia para revisión</h2></div>
      <div class="panel-body">
        <div class="detail-list">
          ${detailBox("Documento", req.evidence)}
          ${detailBox("Requisito", evidenceStatus)}
          ${detailBox("Motivo", req.motive)}
        </div>
        <div class="toolbar" style="margin-top:14px">
          <button class="btn btn-outline" data-action="view-evidence" data-id="${req.id}">Ver evidencia simulada</button>
        </div>
      </div>
    </div>
  `;
}

function reviewForm(req) {
  return `
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Decisión de Dirección</h2></div>
      <div class="panel-body">
        <div class="field">
          <label for="review-comment">Comentario obligatorio</label>
          <textarea id="review-comment">Se revisó la solicitud, fechas, materias afectadas y evidencia adjunta.</textarea>
        </div>
        <div class="toolbar" style="margin-top:14px">
          <button class="btn btn-primary" data-action="approve" data-id="${req.id}">Aprobar e impactar asistencia</button>
          <button class="btn btn-gold" data-action="observe" data-id="${req.id}">Observar</button>
          <button class="btn btn-danger" data-action="reject" data-id="${req.id}">Rechazar</button>
        </div>
      </div>
    </div>
  `;
}

function appealForm(req) {
  return `
    <div class="panel" style="margin-top:16px">
      <div class="panel-header"><h2>Apelación del estudiante</h2></div>
      <div class="panel-body">
        <div class="field">
          <label for="appeal-text">Argumento de apelación</label>
          <textarea id="appeal-text">Adjunto una explicación adicional y solicito nueva revisión de la solicitud.</textarea>
        </div>
        <button class="btn btn-primary" data-action="appeal" data-id="${req.id}">Enviar apelación</button>
      </div>
    </div>
  `;
}

function renderModal() {
  const req = data.requests.find((r) => r.id === state.modal?.id);
  if (!req) return "";
  const isReview = state.modal?.mode === "review";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-box">
        <div class="modal-head">
          <h2 id="modal-title">${isReview ? "Revisión" : "Resumen"} ${req.id}</h2>
          <button class="icon-btn" data-action="close-modal" aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body">${requestDetail(req)}</div>
        <div class="modal-actions">
          <button class="btn btn-outline" data-action="close-modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

function section(title, subtitle, actions, body) {
  return `
    <section>
      <div class="section-title">
        <div>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <div class="topbar-actions">${actions}</div>
      </div>
      ${body}
    </section>
  `;
}

function metric(label, value, hint, tone) {
  const color = tone === "green" ? "green" : tone === "gold" ? "gold" : tone === "red" ? "red" : "";
  return `
    <div class="panel metric ${color}">
      <div class="panel-body">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
        <div class="hint">${hint}</div>
      </div>
    </div>
  `;
}

function requestsTable(requests, withActions, showAppeal) {
  if (!requests.length) return `<div class="empty-state">No hay solicitudes para mostrar.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Código</th><th>Solicitante</th><th>Tipo</th><th>Fechas</th><th>Materias</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map((r) => `
            <tr>
              <td><strong>${r.id}</strong><br><span class="muted">${r.createdAt}</span></td>
              <td>${r.person}<br><span class="muted">${r.code}</span></td>
              <td>${r.type}<br><span class="tag gray">${r.mode}</span></td>
              <td>${r.dates.join("<br>")}</td>
              <td>${r.courses.join("<br>")}</td>
              <td><span class="status ${statusClass(r.status)}">${r.status}</span></td>
              <td>
                <button class="btn btn-small btn-outline" data-action="open-request" data-mode="view" data-id="${r.id}">Ver</button>
                ${withActions && r.status !== "Aprobada" ? `<button class="btn btn-small btn-primary" data-action="open-request" data-mode="review" data-id="${r.id}">Revisar</button>` : ""}
                ${showAppeal && r.status === "Rechazada" ? `<button class="btn btn-small btn-gold" data-action="open-request" data-mode="appeal" data-id="${r.id}">Apelar</button>` : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function coursesTable(courses) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Materia</th><th>Carrera</th><th>Paralelo</th><th>Docente</th><th>Horario</th></tr></thead>
        <tbody>
          ${courses.map((c) => `
            <tr>
              <td>${c.name}</td>
              <td>${c.career}</td>
              <td>${c.parallel}</td>
              <td>${c.teacher}</td>
              <td>${c.schedule}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function calendarStrip() {
  const days = [
    ["Lun 01", "Programación Web III", "P"],
    ["Mar 02", "Base de Datos II", "P"],
    ["Mié 03", "Programación Web III", "P"],
    ["Jue 04", "Matemática Discreta", "L"],
    ["Vie 05", "Base de Datos II", "Observada"],
  ];
  return `
    <div class="calendar-strip">
      ${days.map(([day, course, status]) => `
        <div class="day-card">
          <strong>${day}</strong>
          <span>${course}</span>
          <div class="state"><span class="status ${statusClass(status)}">${status}</span></div>
        </div>
      `).join("")}
    </div>
  `;
}

function detailBox(label, value) {
  return `<div class="detail-box"><small>${label}</small><span>${value}</span></div>`;
}

function alertBox(title, text) {
  return `<div class="alert" style="margin-bottom:10px"><strong>${title}</strong><p>${text}</p></div>`;
}

function ruleList() {
  const rules = [
    "Un formulario de ausencia cubre permisos anticipados y justificaciones posteriores.",
    "No se permite permiso anticipado para fecha pasada; se clasifica como justificación posterior.",
    "No se justifica fecha futura; se clasifica como permiso anticipado.",
    "Motivos con documento obligatorio no avanzan sin evidencia.",
    "Solicitud observada debe corregirse antes de aprobación final.",
    "Estado L de asistencia queda bloqueado para docentes.",
    "Solo Dirección puede cambiar L con comentario de auditoría.",
    "La aprobación ejecuta solicitud, asistencia, notificación y auditoría como una sola transacción.",
  ];
  return `<div class="timeline">${rules.map((r, index) => `<div class="timeline-item"><strong>Regla ${index + 1}</strong><span>${r}</span></div>`).join("")}</div>`;
}

function createRequestFromForm(form, actor) {
  const formData = new FormData(form);
  const courses = formData.getAll("courses");
  const id = `SOL-${String(data.requests.length + 14).padStart(4, "0")}`;
  const person = actor === "docente" ? roleInfo.docente.user : roleInfo.estudiante.user;
  const code = actor === "docente" ? "DOC-041" : "EST-2024-114";
  const motive = formData.get("motive") || "Emergencia familiar";
  const dates = String(formData.get("dates") || "2026-06-07").split(",").map((d) => d.trim()).filter(Boolean);
  const evidence = document.getElementById("evidence")?.files?.[0]?.name || (motive === "Emergencia familiar" ? "No obligatorio" : "respaldo_simulado.pdf");
  const req = {
    id,
    actor,
    person,
    code,
    type: actor === "docente" ? "Ausencia docente" : "Ausencia estudiantil",
    status: "Pendiente",
    motive,
    mode: formData.get("mode") || "Permiso anticipado",
    dates,
    courses: courses.length ? courses : [data.courses[0].name],
    evidence,
    summary: formData.get("summary") || "Solicitud creada desde el prototipo.",
    reviewer: "Pendiente",
    comment: "Sin revisión todavía.",
    createdAt: nowLabel(),
    updatedAt: nowLabel(),
    appeal: false,
  };
  data.requests.unshift(req);
  data.audit.unshift({
    id: `AUD-${1000 + data.audit.length + 1}`,
    date: nowLabel(),
    user: person,
    role: actor === "docente" ? "Docente" : "Estudiante",
    action: `Creó ${id}`,
    before: "No existía",
    after: "Pendiente",
    note: "Solicitud creada desde formulario del prototipo.",
  });
  data.notifications.unshift({
    id: data.notifications.length + 1,
    to: "director",
    title: "Nueva solicitud pendiente",
    text: `${person} creó ${id}.`,
    date: nowLabel(),
    unread: true,
  });
  setView(actor === "docente" ? "dashboard" : "historial");
  showToast(`${id} enviada a Dirección.`);
}

function approveRequest(id) {
  const req = data.requests.find((r) => r.id === id);
  if (!req) return;
  const before = req.status;
  req.status = "Aprobada";
  req.reviewer = roleInfo.director.user;
  req.comment = document.getElementById("review-comment")?.value || "Aprobada por Dirección.";
  req.updatedAt = nowLabel();

  let impact = "";
  if (req.actor === "estudiante") {
    const targetCourse = data.courses.find((c) => req.courses.includes(c.name)) || data.courses[0];
    req.dates.forEach((date) => {
      const existing = data.attendance.find((a) => a.code === req.code && a.date === date && a.courseId === targetCourse.id);
      if (existing) {
        existing.state = "L";
        existing.locked = true;
        existing.note = `Licencia aprobada por ${req.id}`;
      } else {
        data.attendance.push({
          courseId: targetCourse.id,
          date,
          student: req.person,
          code: req.code,
          state: "L",
          locked: true,
          note: `L futura agendada por ${req.id}`,
        });
      }
    });
    impact = "Asistencia actualizada a L y bloqueada.";
  } else {
    impact = "Clase autorizada; estudiantes afectados quedarían P automático.";
  }

  data.audit.unshift({
    id: `AUD-${1000 + data.audit.length + 1}`,
    date: nowLabel(),
    user: roleInfo.director.user,
    role: "Director",
    action: `Aprobó ${id}`,
    before,
    after: "Aprobada",
    note: `${impact} Solicitud, asistencia, auditoría y notificación guardadas como transacción simulada.`,
  });
  data.notifications.unshift({
    id: data.notifications.length + 1,
    to: req.actor,
    title: "Solicitud aprobada",
    text: `${id} fue aprobada. ${impact}`,
    date: nowLabel(),
    unread: true,
  });
  state.modal = null;
  render();
  showToast(`${id} aprobada. ${impact}`);
}

function updateRequestStatus(id, status) {
  const req = data.requests.find((r) => r.id === id);
  if (!req) return;
  const before = req.status;
  req.status = status;
  req.reviewer = roleInfo.director.user;
  req.comment = document.getElementById("review-comment")?.value || `${status} por Dirección.`;
  req.updatedAt = nowLabel();
  req.appeal = status === "Rechazada";
  data.audit.unshift({
    id: `AUD-${1000 + data.audit.length + 1}`,
    date: nowLabel(),
    user: roleInfo.director.user,
    role: "Director",
    action: `${status} ${id}`,
    before,
    after: status,
    note: req.comment,
  });
  data.notifications.unshift({
    id: data.notifications.length + 1,
    to: req.actor,
    title: `Solicitud ${status.toLowerCase()}`,
    text: `${id}: ${req.comment}`,
    date: nowLabel(),
    unread: true,
  });
  state.modal = null;
  render();
  showToast(`${id} quedó en estado ${status}.`);
}

function appealRequest(id) {
  const req = data.requests.find((r) => r.id === id);
  if (!req) return;
  req.appeal = true;
  req.status = "Pendiente";
  req.comment = document.getElementById("appeal-text")?.value || "Apelación enviada.";
  req.updatedAt = nowLabel();
  data.audit.unshift({
    id: `AUD-${1000 + data.audit.length + 1}`,
    date: nowLabel(),
    user: req.person,
    role: "Estudiante",
    action: `Apeló ${id}`,
    before: "Rechazada",
    after: "Pendiente por apelación",
    note: req.comment,
  });
  data.notifications.unshift({
    id: data.notifications.length + 1,
    to: "director",
    title: "Apelación recibida",
    text: `${req.person} apeló ${id}.`,
    date: nowLabel(),
    unread: true,
  });
  state.modal = null;
  render();
  showToast(`Apelación de ${id} enviada a Dirección.`);
}

function markAttendance(code, value) {
  const row = data.attendance.find((a) => a.code === code && a.courseId === state.attendanceCourse && a.date === state.attendanceDate);
  if (!row || row.locked) {
    showToast("Este registro está bloqueado por licencia de Dirección.");
    return;
  }
  const before = row.state;
  row.state = value;
  row.note = "Editado por docente";
  data.audit.unshift({
    id: `AUD-${1000 + data.audit.length + 1}`,
    date: nowLabel(),
    user: roleInfo.docente.user,
    role: "Docente",
    action: `Marcó asistencia ${code}`,
    before,
    after: value,
    note: `Registro manual de asistencia en ${state.attendanceCourse}.`,
  });
  render();
  showToast(`Asistencia de ${row.student}: ${stateText(value)}.`);
}

function currentView() {
  if (!state.role) return loginView();
  if (state.view === "dashboard") return dashboardByRole();
  if (state.view === "solicitud") return requestForm("estudiante");
  if (state.view === "solicitud-docente") return requestForm("docente");
  if (state.view === "historial") return historyView();
  if (state.view === "notificaciones") return notificationsView();
  if (state.view === "asistencia") return attendanceView();
  if (state.view === "apelaciones") return appealsView();
  if (state.view === "auditoria") return auditView();
  if (state.view === "reportes") return reportsView();
  if (state.view === "catalogos") return catalogView();
  return dashboardByRole();
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = state.role ? appShell(currentView()) : currentView();
}

document.addEventListener("click", (event) => {
  const login = event.target.closest("[data-login]");
  if (login) {
    setRole(login.dataset.login);
    return;
  }

  const view = event.target.closest("[data-view]");
  if (view) {
    setView(view.dataset.view);
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  const id = action.dataset.id;
  switch (action.dataset.action) {
    case "logout":
      logout();
      break;
    case "toggle-sidebar":
      state.sidebarOpen = !state.sidebarOpen;
      render();
      break;
    case "open-request":
      state.modal = { id, mode: action.dataset.mode || "view" };
      render();
      break;
    case "close-modal":
      state.modal = null;
      render();
      break;
    case "approve":
      approveRequest(id);
      break;
    case "observe":
      updateRequestStatus(id, "Observada");
      break;
    case "reject":
      updateRequestStatus(id, "Rechazada");
      break;
    case "appeal":
      appealRequest(id);
      break;
    case "mark-attendance":
      markAttendance(action.dataset.code, action.dataset.state);
      break;
    case "view-evidence":
      showToast(`Evidencia de ${id}: archivo simulado disponible para revisión.`);
      break;
    case "fake-export":
      showToast("Exportación simulada: en el sistema real se generaría PDF/Excel.");
      break;
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-action='change-course']")) {
    state.attendanceCourse = event.target.value;
    render();
  }
  if (event.target.matches("[data-action='change-date']")) {
    state.attendanceDate = event.target.value;
    render();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  createRequestFromForm(form, form.dataset.form === "teacher-request" ? "docente" : "estudiante");
});

render();
