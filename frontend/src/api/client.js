const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Seed Users from seed.js
const MOCK_USERS = [
  {
    username: "admin",
    email: "admin@sigepej.com",
    role: "administrador",
    firstName: "Administrador",
    lastName: "SIGEPEJ",
    code: "ADM-001"
  },
  {
    username: "director_sistemas",
    email: "director.sistemas@univalle.edu",
    role: "director",
    firstName: "Christian",
    lastName: "Montano",
    code: "DIR-SIS-001"
  },
  {
    username: "secretaria_sistemas",
    email: "secretaria.sistemas@univalle.edu",
    role: "secretario",
    firstName: "Secretaria",
    lastName: "Académica",
    code: "SEC-SIS-001"
  },
  {
    username: "ana_rojas",
    email: "ana.rojas@univalle.edu",
    role: "docente",
    firstName: "Ana",
    lastName: "Rojas",
    code: "DOC-001"
  },
  {
    username: "carlos_mendez",
    email: "carlos.mendez@univalle.edu",
    role: "docente",
    firstName: "Carlos",
    lastName: "Mendez",
    code: "DOC-002"
  },
  {
    username: "ricardo_np",
    email: "ricardo.nunez@univalle.edu",
    role: "estudiante",
    firstName: "Ricardo",
    lastName: "Núñez del Prado",
    code: "EST-2026-001"
  },
  {
    username: "daniel_escobar",
    email: "daniel.escobar@univalle.edu",
    role: "estudiante",
    firstName: "Daniel",
    lastName: "Escobar Pozo",
    code: "EST-2026-002"
  },
  {
    username: "josue_rodriguez",
    email: "josue.rodriguez@univalle.edu",
    role: "estudiante",
    firstName: "Josué",
    lastName: "Rodriguez Vera",
    code: "EST-2026-003"
  },
  {
    username: "luis_lopez",
    email: "luis.lopez@univalle.edu",
    role: "estudiante",
    firstName: "Luis Fernando",
    lastName: "López",
    code: "EST-2026-004"
  }
];

// Seed Courses from seed.js
const MOCK_COURSES = [
  {
    id: "course-web3",
    code: "WEB3-G1-2026-1",
    subjectName: "Programación Web III",
    subjectCode: "WEB3",
    parallel: "G1",
    teacherName: "Ana Rojas",
    teacherUsername: "ana_rojas"
  },
  {
    id: "course-bd2",
    code: "BD2-G1-2026-1",
    subjectName: "Base de Datos II",
    subjectCode: "BD2",
    parallel: "G1",
    teacherName: "Carlos Mendez",
    teacherUsername: "carlos_mendez"
  },
  {
    id: "course-prog3",
    code: "PROG3-G2-2026-1",
    subjectName: "Programación III",
    subjectCode: "PROG3",
    parallel: "G2",
    teacherName: "Ana Rojas",
    teacherUsername: "ana_rojas"
  }
];

// Default seed requests matching seed.js
const INITIAL_MOCK_REQUESTS = [
  {
    id: "req-001",
    code: "SOL-2026-001",
    requesterUsername: "ricardo_np",
    requesterName: "Ricardo Núñez del Prado",
    requesterRole: "estudiante",
    requestType: "ausencia_estudiantil",
    mode: "permiso_anticipado",
    reasonType: "academico",
    reasonDetail: "Participacion en actividad académica institucional.",
    status: "pendiente",
    dates: [{ date: "2026-06-10", courseCode: "WEB3-G1-2026-1", courseName: "Programación Web III" }],
    courses: ["WEB3-G1-2026-1"],
    evidenceRequired: false,
    reviewComment: "",
    evidenceUrl: ""
  },
  {
    id: "req-002",
    code: "SOL-2026-002",
    requesterUsername: "daniel_escobar",
    requesterName: "Daniel Escobar Pozo",
    requesterRole: "estudiante",
    requestType: "ausencia_estudiantil",
    mode: "justificacion_posterior",
    reasonType: "salud",
    reasonDetail: "Consulta médica por emergencia familiar.",
    status: "observada",
    dates: [{ date: "2026-06-02", courseCode: "WEB3-G1-2026-1", courseName: "Programación Web III" }],
    courses: ["WEB3-G1-2026-1"],
    evidenceRequired: true,
    reviewComment: "Adjuntar certificado médico legible.",
    evidenceUrl: "http://localhost:5000/uploads/evidences/certificado-médico-demo.pdf",
    evidenceName: "certificado-médico-demo.pdf"
  },
  {
    id: "req-003",
    code: "SOL-2026-003",
    requesterUsername: "ana_rojas",
    requesterName: "Ana Rojas",
    requesterRole: "docente",
    requestType: "ausencia_docente",
    mode: "permiso_anticipado",
    reasonType: "academico",
    reasonDetail: "Capacitacion docente programada por la universidad.",
    status: "aprobada",
    dates: [
      { date: "2026-06-12", courseCode: "WEB3-G1-2026-1", courseName: "Programación Web III" },
      { date: "2026-06-12", courseCode: "PROG3-G2-2026-1", courseName: "Programación III" }
    ],
    courses: ["WEB3-G1-2026-1", "PROG3-G2-2026-1"],
    evidenceRequired: false,
    reviewComment: "Aprobado. Coordinar reemplazo o reposicion.",
    evidenceUrl: ""
  }
];

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    _id: "notif-001",
    title: "Solicitud aprobada",
    message: "Tu solicitud de ausencia fue aprobada.",
    type: "revision",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "notif-002",
    title: "Solicitud observada",
    message: "Debes corregir la evidencia adjunta.",
    type: "solicitud",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "notif-003",
    title: "Asistencia actualizada",
    message: "Una licencia fue aplicada como L en asistencia.",
    type: "asistencia",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_MOCK_CAREERS = [
  {
    _id: "career-sis",
    code: "SIS",
    name: "Ingenieria de Sistemas",
    director: { firstName: "Christian", lastName: "Montano", code: "DIR-SIS-001" },
    isActive: true
  }
];

const INITIAL_MOCK_SUBJECTS = [
  { _id: "sub-web3", code: "WEB3", name: "Programación Web III", career: INITIAL_MOCK_CAREERS[0], semester: 6, isActive: true },
  { _id: "sub-bd2", code: "BD2", name: "Base de Datos II", career: INITIAL_MOCK_CAREERS[0], semester: 5, isActive: true },
  { _id: "sub-prog3", code: "PROG3", name: "Programación III", career: INITIAL_MOCK_CAREERS[0], semester: 4, isActive: true }
];

const INITIAL_MOCK_COURSES_EXPANDED = MOCK_COURSES.map((course) => ({
  _id: course.id,
  code: course.code,
  subject: {
    _id: `sub-${course.subjectCode.toLowerCase()}`,
    code: course.subjectCode,
    name: course.subjectName
  },
  career: INITIAL_MOCK_CAREERS[0],
  teacher: {
    firstName: course.teacherName.split(" ")[0],
    lastName: course.teacherName.split(" ").slice(1).join(" "),
    code: course.teacherUsername
  },
  parallel: course.parallel,
  period: "2026-1",
  schedule: [{ day: "lunes", startTime: "08:00", endTime: "10:00", classroom: "Lab 3" }],
  isActive: true
}));

const INITIAL_MOCK_AUDIT = [
  {
    _id: "audit-001",
    actor: { firstName: "Ricardo", lastName: "Núñez del Prado", role: "estudiante", code: "EST-2026-001", username: "ricardo_np" },
    action: "crear_solicitud",
    entityType: "Request",
    entityId: "req-001",
    metadata: { status: "pendiente", mode: "permiso_anticipado" },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "audit-002",
    actor: { firstName: "Christian", lastName: "Montano", role: "director", code: "DIR-SIS-001", username: "director_sistemas" },
    action: "observado_solicitud",
    entityType: "Request",
    entityId: "req-002",
    metadata: { status: "observado", comment: "Adjuntar certificado médico legible." },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

// Initialize mock DB in localStorage
function initMockDb() {
  if (!localStorage.getItem("sigepej_mock_requests")) {
    localStorage.setItem("sigepej_mock_requests", JSON.stringify(INITIAL_MOCK_REQUESTS));
  }
  if (!localStorage.getItem("sigepej_mock_notifications")) {
    localStorage.setItem("sigepej_mock_notifications", JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
  }
  if (!localStorage.getItem("sigepej_mock_users")) {
    const users = MOCK_USERS.map((user) => ({
      _id: `usr-${user.username}`,
      id: `usr-${user.username}`,
      ...user,
      isActive: true,
      career: user.role !== "administrador" ? INITIAL_MOCK_CAREERS[0] : undefined
    }));
    localStorage.setItem("sigepej_mock_users", JSON.stringify(users));
  }
  if (!localStorage.getItem("sigepej_mock_careers")) {
    localStorage.setItem("sigepej_mock_careers", JSON.stringify(INITIAL_MOCK_CAREERS));
  }
  if (!localStorage.getItem("sigepej_mock_subjects")) {
    localStorage.setItem("sigepej_mock_subjects", JSON.stringify(INITIAL_MOCK_SUBJECTS));
  }
  if (!localStorage.getItem("sigepej_mock_courses")) {
    localStorage.setItem("sigepej_mock_courses", JSON.stringify(INITIAL_MOCK_COURSES_EXPANDED));
  }
  if (!localStorage.getItem("sigepej_mock_audit")) {
    localStorage.setItem("sigepej_mock_audit", JSON.stringify(INITIAL_MOCK_AUDIT));
  }
}
initMockDb();

function getMockRequests() {
  return JSON.parse(localStorage.getItem("sigepej_mock_requests"));
}

function saveMockRequests(requests) {
  localStorage.setItem("sigepej_mock_requests", JSON.stringify(requests));
}

function getStoredArray(key, fallback = []) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function saveStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getMockNotifications() {
  return getStoredArray("sigepej_mock_notifications", INITIAL_MOCK_NOTIFICATIONS);
}

function saveMockNotifications(notifications) {
  saveStoredArray("sigepej_mock_notifications", notifications);
}

function getMockUsers() {
  return getStoredArray("sigepej_mock_users");
}

function saveMockUsers(users) {
  saveStoredArray("sigepej_mock_users", users);
}

function getMockCareers() {
  return getStoredArray("sigepej_mock_careers", INITIAL_MOCK_CAREERS);
}

function saveMockCareers(careers) {
  saveStoredArray("sigepej_mock_careers", careers);
}

function getMockSubjects() {
  return getStoredArray("sigepej_mock_subjects", INITIAL_MOCK_SUBJECTS);
}

function saveMockSubjects(subjects) {
  saveStoredArray("sigepej_mock_subjects", subjects);
}

function getMockCourses() {
  return getStoredArray("sigepej_mock_courses", INITIAL_MOCK_COURSES_EXPANDED);
}

function saveMockCourses(courses) {
  saveStoredArray("sigepej_mock_courses", courses);
}

function getMockAudit() {
  return getStoredArray("sigepej_mock_audit", INITIAL_MOCK_AUDIT);
}

function saveMockAudit(audit) {
  saveStoredArray("sigepej_mock_audit", audit);
}

function addMockAuditLog(action, entityType, entityId, metadata) {
  const audit = getMockAudit();
  const currentUser = JSON.parse(localStorage.getItem("sigepej_user") || "{}");
  audit.unshift({
    _id: `audit-${Date.now()}`,
    actor: {
      firstName: currentUser.firstName || "Admin",
      lastName: currentUser.lastName || "SIGEPEJ",
      role: currentUser.role || "administrador",
      code: currentUser.code || "ADM-001",
      username: currentUser.username || "admin"
    },
    action,
    entityType,
    entityId,
    metadata,
    createdAt: new Date().toISOString()
  });
  saveMockAudit(audit);
}

function normalizeStatus(status) {
  const map = {
    aprobada: "aprobado",
    aprobado: "aprobado",
    observada: "observado",
    observado: "observado",
    rechazada: "rechazado",
    rechazado: "rechazado",
    apelada: "apelado",
    apelado: "apelado",
    pendiente: "pendiente"
  };
  return map[String(status || "").toLowerCase()] || status;
}

function resolveEvidenceUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

function normalizeRequest(request) {
  return {
    ...request,
    id: request.id || request._id,
    code: request.code || `SOL-${String(request._id || request.id || "").slice(-6)}`,
    requesterName:
      request.requesterName ||
      (request.requester
        ? `${request.requester.firstName || ""} ${request.requester.lastName || ""}`.trim()
        : ""),
    requesterUsername: request.requesterUsername || request.requester?.username,
    dates: (request.dates || []).map((item) => ({
      ...item,
      courseId: item.courseId || item.course?._id || item.course,
      courseCode: item.courseCode || item.course?.code,
      courseName: item.courseName || item.course?.subject?.name || item.course?.subjectName,
      date: typeof item.date === "string" ? item.date.slice(0, 10) : item.date
    })),
    courses: (request.courses || []).map((course) =>
      typeof course === "string"
        ? course
        : {
            id: course.id || course._id,
            code: course.code,
            subjectName: course.subjectName || course.subject?.name,
            parallel: course.parallel
          }
    ),
    evidenceUrl: resolveEvidenceUrl(request.evidenceUrl || request.evidence?.url),
    evidenceName: request.evidenceName || request.evidence?.originalName
  };
}

function getMockAttendance(courseIdOrCode, date) {
  const course =
    MOCK_COURSES.find((item) => item.id === courseIdOrCode || item.code === courseIdOrCode) ||
    MOCK_COURSES[0];
  const key = `sigepej_mock_attendance_${course.code}_${date}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    return JSON.parse(stored);
  }

  const students = MOCK_USERS.filter((user) => user.role === "estudiante");
  const attendance = {
    id: key,
    _id: key,
    course,
    date,
    records: students.map((student, index) => ({
      recordId: `${key}_${student.code}`,
      student: {
        id: student.code,
        code: student.code,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      },
      status: index === 1 && date === "2026-06-02" ? "F" : "P",
      lockedByRequest: false,
      note: ""
    }))
  };

  localStorage.setItem(key, JSON.stringify(attendance));
  return attendance;
}

function saveMockAttendanceRecord(recordId, status, note = "") {
  const keys = Object.keys(localStorage).filter((key) => key.startsWith("sigepej_mock_attendance_"));

  for (const key of keys) {
    const attendance = JSON.parse(localStorage.getItem(key));
    const record = attendance.records.find((item) => item.recordId === recordId);
    if (!record) continue;
    if (record.lockedByRequest) {
      throw new Error("No se puede modificar una licencia bloqueada por Dirección.");
    }
    record.status = status;
    record.note = note;
    localStorage.setItem(key, JSON.stringify(attendance));
    return { ok: true, record };
  }

  throw new Error("Registro de asistencia no encontrado en mock DB");
}

// Headers builder
function getHeaders(isMultipart = false) {
  const token = localStorage.getItem("sigepej_token");
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  // Login
  async login(usernameOrEmail, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: usernameOrEmail,
          username: usernameOrEmail,
          email: usernameOrEmail,
          password
        })
      });

      if (response.ok) {
        return await response.json();
      }

      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "Error al iniciar sesión");
    } catch (error) {
      console.warn("Backend login failed or unavailable, falling back to mock database:", error.message);

      // Fallback Mock Authentication
      const user = MOCK_USERS.find(
        (u) =>
          (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
          password === "password123"
      );

      if (user) {
        return {
          token: "mock-jwt-token-sigepej-2026",
          user: {
            id: `usr-${user.username}`,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            code: user.code
          }
        };
      }

      throw new Error("Credenciales incorrectas. Verifique su usuario y contraseña.");
    }
  },

  // Get User Courses/Subjects
  async getMyCourses(username, role) {
    try {
      const response = await fetch(`${API_URL}/courses/my`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching courses");
    } catch (error) {
      console.warn("Backend getMyCourses failed, using mock data:", error.message);
      if (role === "docente") {
        return MOCK_COURSES.filter((c) => c.teacherUsername === username);
      } else {
        return MOCK_COURSES;
      }
    }
  },

  // Get Requests List
  async getMyRequests(username) {
    try {
      const response = await fetch(`${API_URL}/requests/my`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data.map(normalizeRequest) : [];
      }
      throw new Error("API error fetching requests");
    } catch (error) {
      console.warn("Backend getMyRequests failed, using mock data:", error.message);
      const requests = getMockRequests();
      return requests.filter((r) => r.requesterUsername === username).map(normalizeRequest);
    }
  },

  async getAllRequests(status = "todos") {
    try {
      const query = status && status !== "todos" ? `?status=${encodeURIComponent(status)}` : "";
      const response = await fetch(`${API_URL}/requests${query}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return (data.requests || []).map(normalizeRequest);
      }
      throw new Error("API error fetching all requests");
    } catch (error) {
      console.warn("Backend getAllRequests failed, using mock data:", error.message);
      const requests = getMockRequests().map(normalizeRequest);
      if (!status || status === "todos") return requests;
      return requests.filter((request) => normalizeStatus(request.status) === normalizeStatus(status));
    }
  },

  // Create Request
  async createRequest(formData) {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData
      });
      if (response.ok) return await response.json();
      throw new Error("API error creating request");
    } catch (error) {
      console.warn("Backend createRequest failed, saving to mock data:", error.message);

      const requestType = formData.get("requestType");
      const mode = formData.get("mode");
      const reasonType = formData.get("reasonType");
      const reasonDetail = formData.get("reasonDetail");
      const requesterRole = formData.get("requesterRole") || "estudiante";

      const file = formData.get("evidence");
      let evidenceUrl = "";
      let evidenceName = "";
      if (file && file instanceof File && file.size > 0) {
        evidenceUrl = URL.createObjectURL(file);
        evidenceName = file.name;
      }

      let datesStr = formData.get("dates");
      let dates = [];
      try {
        dates = JSON.parse(datesStr);
      } catch (e) {
        const singleDate = formData.get("date");
        const singleCourse = formData.get("course");
        if (singleDate && singleCourse) {
          const course = MOCK_COURSES.find(c => c.code === singleCourse || c.id === singleCourse) || { subjectName: "Materia" };
          dates = [{ date: singleDate, courseCode: course.code, courseName: course.subjectName }];
        }
      }

      const courses = dates.map(d => d.courseCode);
      const requests = getMockRequests();
      const currentUser = JSON.parse(localStorage.getItem("sigepej_user")) || {};
      const newCode = `SOL-2026-${String(requests.length + 1).padStart(3, "0")}`;

      const newRequest = {
        id: `req-${Date.now()}`,
        code: newCode,
        requesterUsername: currentUser.username || "anon",
        requesterName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Usuario",
        requesterRole,
        requestType,
        mode,
        reasonType,
        reasonDetail,
        status: "pendiente",
        dates,
        courses,
        evidenceRequired: reasonType === "salud",
        reviewComment: "",
        evidenceUrl,
        evidenceName
      };

      requests.unshift(newRequest);
      saveMockRequests(requests);
      return { ok: true, request: newRequest };
    }
  },

  // Edit Request (Corregir)
  async updateRequest(id, formData) {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        return { ...data, request: normalizeRequest(data.request) };
      }
      throw new Error("API error updating request");
    } catch (error) {
      console.warn("Backend updateRequest failed, updating mock data:", error.message);

      const requests = getMockRequests();
      const idx = requests.findIndex(r => r.id === id || r.code === id);
      if (idx !== -1) {
        const file = formData.get("evidence");
        if (file && file instanceof File && file.size > 0) {
          requests[idx].evidenceUrl = URL.createObjectURL(file);
          requests[idx].evidenceName = file.name;
        }
        requests[idx].reasonDetail = formData.get("reasonDetail") || requests[idx].reasonDetail;
        requests[idx].status = "pendiente";
        requests[idx].reviewComment = "";
        saveMockRequests(requests);
        return { ok: true, request: requests[idx] };
      }
      throw new Error("Solicitud no encontrada en mock DB");
    }
  },

  // Apelar Request
  async appealRequest(id, justification) {
    try {
      const response = await fetch(`${API_URL}/requests/${id}/appeal`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ justification })
      });
      if (response.ok) {
        const data = await response.json();
        return { ...data, request: normalizeRequest(data.request) };
      }
      throw new Error("API error appealing request");
    } catch (error) {
      console.warn("Backend appealRequest failed, updating mock data:", error.message);

      const requests = getMockRequests();
      const idx = requests.findIndex(r => r.id === id || r.code === id);
      if (idx !== -1) {
        requests[idx].status = "apelado";
        requests[idx].appealComment = justification;
        requests[idx].reviewComment = "";
        saveMockRequests(requests);
        return { ok: true, request: requests[idx] };
      }
      throw new Error("Solicitud no encontrada en mock DB");
    }
  },

  async getNotifications() {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return data.notifications || [];
      }
      throw new Error("API error fetching notifications");
    } catch (error) {
      console.warn("Backend getNotifications failed, using mock data:", error.message);
      return getMockNotifications();
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error marking notification as read");
    } catch (error) {
      console.warn("Backend markNotificationAsRead failed, using mock data:", error.message);
      const notifications = getMockNotifications();
      const notification = notifications.find((item) => item._id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        saveMockNotifications(notifications);
      }
      return { _id: notificationId, read: true };
    }
  },

  async markAllNotificationsAsRead() {
    try {
      const response = await fetch(`${API_URL}/notifications/read/all`, {
        method: "PATCH",
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error marking all notifications as read");
    } catch (error) {
      console.warn("Backend markAllNotificationsAsRead failed, using mock data:", error.message);
      const notifications = getMockNotifications().map((item) => ({
        ...item,
        read: true,
        readAt: new Date().toISOString()
      }));
      saveMockNotifications(notifications);
      return { message: "Notificaciónes marcadas como leidas" };
    }
  },

  async getUnreadCount() {
    try {
      const response = await fetch(`${API_URL}/notifications/unread/count`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        return data.unreadCount || 0;
      }
      throw new Error("API error fetching unread count");
    } catch (error) {
      console.warn("Backend getUnreadCount failed, using mock data:", error.message);
      return getMockNotifications().filter((item) => !item.read).length;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error deleting notification");
    } catch (error) {
      console.warn("Backend deleteNotification failed, using mock data:", error.message);
      saveMockNotifications(getMockNotifications().filter((item) => item._id !== notificationId));
      return { message: "Notificación eliminada" };
    }
  },

  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching users");
    } catch (error) {
      console.warn("Backend getUsers failed, using mock data:", error.message);
      return getMockUsers();
    }
  },

  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      if (response.ok) return await response.json();
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API error creating user");
    } catch (error) {
      console.warn("Backend createUser failed, using mock data:", error.message);
      const users = getMockUsers();
      const exists = users.find((user) => user.username === userData.username || user.email === userData.email);
      if (exists) throw new Error("El usuario o correo electronico ya esta registrado");
      const newUser = {
        _id: `usr-${userData.username}`,
        id: `usr-${userData.username}`,
        ...userData,
        isActive: true
      };
      users.unshift(newUser);
      saveMockUsers(users);
      addMockAuditLog("crear_usuario", "User", newUser._id, { username: newUser.username, role: newUser.role });
      return newUser;
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ role })
      });
      if (response.ok) return await response.json();
      throw new Error("API error updating user role");
    } catch (error) {
      console.warn("Backend updateUserRole failed, using mock data:", error.message);
      const users = getMockUsers();
      const index = users.findIndex((user) => user._id === userId || user.id === userId);
      if (index === -1) throw new Error("Usuario no encontrado en mock DB");
      const oldRole = users[index].role;
      users[index].role = role;
      saveMockUsers(users);
      addMockAuditLog("cambiar_rol", "User", userId, { username: users[index].username, oldRole, newRole: role });
      return users[index];
    }
  },

  async updateUserStatus(userId, isActive) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ isActive })
      });
      if (response.ok) return await response.json();
      throw new Error("API error updating user status");
    } catch (error) {
      console.warn("Backend updateUserStatus failed, using mock data:", error.message);
      const users = getMockUsers();
      const index = users.findIndex((user) => user._id === userId || user.id === userId);
      if (index === -1) throw new Error("Usuario no encontrado en mock DB");
      users[index].isActive = isActive;
      saveMockUsers(users);
      addMockAuditLog(isActive ? "desbloquear_usuario" : "bloquear_usuario", "User", userId, { username: users[index].username });
      return users[index];
    }
  },

  async getCareers() {
    try {
      const response = await fetch(`${API_URL}/catalogs/careers`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching careers");
    } catch (error) {
      console.warn("Backend getCareers failed, using mock data:", error.message);
      return getMockCareers();
    }
  },

  async createCareer(careerData) {
    try {
      const response = await fetch(`${API_URL}/catalogs/careers`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(careerData)
      });
      if (response.ok) return await response.json();
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API error creating career");
    } catch (error) {
      console.warn("Backend createCareer failed, using mock data:", error.message);
      const careers = getMockCareers();
      if (careers.find((career) => career.code === careerData.code.toUpperCase())) {
        throw new Error("Ya existe una carrera con ese código");
      }
      const newCareer = {
        _id: `career-${Date.now()}`,
        code: careerData.code.toUpperCase().trim(),
        name: careerData.name,
        director: undefined,
        isActive: true
      };
      careers.unshift(newCareer);
      saveMockCareers(careers);
      addMockAuditLog("crear_carrera", "Career", newCareer._id, { code: newCareer.code, name: newCareer.name });
      return newCareer;
    }
  },

  async getSubjects() {
    try {
      const response = await fetch(`${API_URL}/catalogs/subjects`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching subjects");
    } catch (error) {
      console.warn("Backend getSubjects failed, using mock data:", error.message);
      return getMockSubjects();
    }
  },

  async createSubject(subjectData) {
    try {
      const response = await fetch(`${API_URL}/catalogs/subjects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(subjectData)
      });
      if (response.ok) return await response.json();
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API error creating subject");
    } catch (error) {
      console.warn("Backend createSubject failed, using mock data:", error.message);
      const subjects = getMockSubjects();
      if (subjects.find((subject) => subject.code === subjectData.code.toUpperCase())) {
        throw new Error("Ya existe una materia con ese código");
      }
      const career = getMockCareers().find((item) => item._id === subjectData.career || item.code === subjectData.career);
      const newSubject = {
        _id: `sub-${Date.now()}`,
        code: subjectData.code.toUpperCase().trim(),
        name: subjectData.name,
        career: career || INITIAL_MOCK_CAREERS[0],
        semester: Number(subjectData.semester),
        isActive: true
      };
      subjects.unshift(newSubject);
      saveMockSubjects(subjects);
      addMockAuditLog("crear_materia", "Subject", newSubject._id, { code: newSubject.code, name: newSubject.name });
      return newSubject;
    }
  },

  async getCourses() {
    try {
      const response = await fetch(`${API_URL}/catalogs/courses`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching courses");
    } catch (error) {
      console.warn("Backend getCourses failed, using mock data:", error.message);
      return getMockCourses();
    }
  },

  async createCourse(courseData) {
    try {
      const response = await fetch(`${API_URL}/catalogs/courses`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(courseData)
      });
      if (response.ok) return await response.json();
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "API error creating course");
    } catch (error) {
      console.warn("Backend createCourse failed, using mock data:", error.message);
      const courses = getMockCourses();
      if (courses.find((course) => course.code === courseData.code.toUpperCase())) {
        throw new Error("Ya existe un curso/paralelo con ese código");
      }
      const newCourse = {
        _id: `course-${Date.now()}`,
        code: courseData.code.toUpperCase().trim(),
        subject: getMockSubjects().find((subject) => subject._id === courseData.subject) || INITIAL_MOCK_SUBJECTS[0],
        career: getMockCareers().find((career) => career._id === courseData.career) || INITIAL_MOCK_CAREERS[0],
        teacher: getMockUsers().find((user) => user._id === courseData.teacher) || { firstName: "Docente", lastName: "Asignado" },
        parallel: courseData.parallel.toUpperCase().trim(),
        period: courseData.period,
        schedule: courseData.schedule || [],
        isActive: true
      };
      courses.unshift(newCourse);
      saveMockCourses(courses);
      addMockAuditLog("crear_paralelo", "Course", newCourse._id, { code: newCourse.code, parallel: newCourse.parallel });
      return newCourse;
    }
  },

  async getAuditLogs() {
    try {
      const response = await fetch(`${API_URL}/audit`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching audit logs");
    } catch (error) {
      console.warn("Backend getAuditLogs failed, using mock data:", error.message);
      return getMockAudit();
    }
  },

  async getReportStats(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_URL}/reports/stats${query}`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching report stats");
    } catch (error) {
      console.warn("Backend getReportStats failed, using mock data:", error.message);
      const users = getMockUsers();
      const requests = getMockRequests();
      const countStatus = (status) => requests.filter((item) => normalizeStatus(item.status) === status).length;
      const countReason = (reason) => requests.filter((item) => item.reasonType === reason).length;
      return {
        summary: {
          totalUsers: users.length,
          pendingRequests: countStatus("pendiente"),
          approvedRequests: countStatus("aprobado"),
          observedRequests: countStatus("observado"),
          rejectedRequests: countStatus("rechazado"),
          totalRequests: requests.length,
          attendanceRate: 88,
          licenseRecords: 5
        },
        requestsByReason: [
          { name: "Salud", value: countReason("salud") },
          { name: "Académico", value: countReason("academico") },
          { name: "Personal", value: countReason("personal") },
          { name: "Otros", value: countReason("otro") }
        ]
      };
    }
  },

  async reviewRequest(id, status, reviewComment = "") {
    try {
      const response = await fetch(`${API_URL}/requests/${id}/review`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status, reviewComment })
      });
      if (response.ok) {
        const data = await response.json();
        return { ...data, request: normalizeRequest(data.request) };
      }
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "API error reviewing request");
    } catch (error) {
      console.warn("Backend reviewRequest failed, updating mock data:", error.message);
      const requests = getMockRequests();
      const idx = requests.findIndex((request) => request.id === id || request._id === id || request.code === id);
      if (idx === -1) throw new Error("Solicitud no encontrada en mock DB");

      requests[idx].status = normalizeStatus(status);
      requests[idx].reviewComment = reviewComment;
      requests[idx].reviewedAt = new Date().toISOString();
      saveMockRequests(requests);
      return { ok: true, request: normalizeRequest(requests[idx]) };
    }
  },

  async getAttendance(courseIdOrCode, date) {
    try {
      const response = await fetch(
        `${API_URL}/attendance?courseId=${encodeURIComponent(courseIdOrCode)}&date=${encodeURIComponent(date)}`,
        { headers: getHeaders() }
      );
      if (response.ok) {
        const payload = await response.json();
        const data = payload.data;
        return {
          id: `${data.course.id}-${date}`,
          _id: `${data.course.id}-${date}`,
          course: data.course,
          date: data.date,
          records: (data.attendance || []).map((record) => {
            const [firstName = "Estudiante", ...lastNameParts] = String(record.studentName || "").split(" ");
            return {
              recordId: record.recordId,
              student: {
                id: record.studentId,
                code: record.studentCode,
                firstName,
                lastName: lastNameParts.join(" "),
                email: record.studentEmail
              },
              status: record.status,
              lockedByRequest: record.isLocked,
              note: record.note,
              request: record.request
            };
          })
        };
      }
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "API error fetching attendance");
    } catch (error) {
      console.warn("Backend getAttendance failed, using mock data:", error.message);
      return getMockAttendance(courseIdOrCode, date);
    }
  },

  async updateAttendance(recordId, status, note = "") {
    try {
      const response = await fetch(`${API_URL}/attendance/${recordId}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status, note })
      });
      if (response.ok) return await response.json();
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "API error updating attendance");
    } catch (error) {
      console.warn("Backend updateAttendance failed, updating mock data:", error.message);
      return saveMockAttendanceRecord(recordId, status, note);
    }
  },

  async updateAttendanceByDirector(recordId, newStatus, justification) {
    const response = await fetch(`${API_URL}/attendance/unlock/${recordId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ newStatus, justification })
    });
    if (response.ok) return await response.json();
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "No se pudo modificar la licencia por Dirección");
  }
};



