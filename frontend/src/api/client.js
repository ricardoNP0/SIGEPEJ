const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    lastName: "Academica",
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
    lastName: "Nunez del Prado",
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
    firstName: "Josue",
    lastName: "Rodriguez Vera",
    code: "EST-2026-003"
  },
  {
    username: "luis_lopez",
    email: "luis.lopez@univalle.edu",
    role: "estudiante",
    firstName: "Luis Fernando",
    lastName: "Lopez",
    code: "EST-2026-004"
  }
];

// Seed Courses from seed.js
const MOCK_COURSES = [
  {
    id: "course-web3",
    code: "WEB3-G1-2026-1",
    subjectName: "Programacion Web III",
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
    subjectName: "Programacion III",
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
    requesterName: "Ricardo Nunez del Prado",
    requesterRole: "estudiante",
    requestType: "ausencia_estudiantil",
    mode: "permiso_anticipado",
    reasonType: "academico",
    reasonDetail: "Participacion en actividad academica institucional.",
    status: "pendiente",
    dates: [{ date: "2026-06-10", courseCode: "WEB3-G1-2026-1", courseName: "Programacion Web III" }],
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
    reasonDetail: "Consulta medica por emergencia familiar.",
    status: "observada",
    dates: [{ date: "2026-06-02", courseCode: "WEB3-G1-2026-1", courseName: "Programacion Web III" }],
    courses: ["WEB3-G1-2026-1"],
    evidenceRequired: true,
    reviewComment: "Adjuntar certificado medico legible.",
    evidenceUrl: "http://localhost:5000/uploads/evidences/certificado-medico-demo.pdf",
    evidenceName: "certificado-medico-demo.pdf"
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
      { date: "2026-06-12", courseCode: "WEB3-G1-2026-1", courseName: "Programacion Web III" },
      { date: "2026-06-12", courseCode: "PROG3-G2-2026-1", courseName: "Programacion III" }
    ],
    courses: ["WEB3-G1-2026-1", "PROG3-G2-2026-1"],
    evidenceRequired: false,
    reviewComment: "Aprobado. Coordinar reemplazo o reposicion.",
    evidenceUrl: ""
  }
];

// Default seed notifications
const INITIAL_MOCK_NOTIFICATIONS = [
  {
    _id: "notif-001",
    title: "Solicitud aprobada",
    message: "Tu solicitud de ausencia ha sido aprobada",
    type: "solicitud",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "notif-002",
    title: "Solicitud observada",
    message: "Necesitas adjuntar documentación para tu solicitud",
    type: "revision",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "notif-003",
    title: "Nueva asistencia registrada",
    message: "Se ha registrado tu asistencia en Programación Web III",
    type: "asistencia",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Default seed values for catalogs, users, audit logs
const INITIAL_MOCK_CAREERS = [
  { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas", director: { firstName: "Christian", lastName: "Montano", code: "DIR-SIS-001" }, isActive: true }
];

const INITIAL_MOCK_SUBJECTS = [
  { _id: "sub-web3", code: "WEB3", name: "Programacion Web III", career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" }, semester: 6, isActive: true },
  { _id: "sub-bd2", code: "BD2", name: "Base de Datos II", career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" }, semester: 5, isActive: true },
  { _id: "sub-prog3", code: "PROG3", name: "Programacion III", career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" }, semester: 4, isActive: true }
];

const INITIAL_MOCK_COURSES_EXPANDED = [
  {
    _id: "course-web3",
    code: "WEB3-G1-2026-1",
    subject: { _id: "sub-web3", code: "WEB3", name: "Programacion Web III" },
    career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" },
    teacher: { firstName: "Ana", lastName: "Rojas", code: "DOC-001" },
    parallel: "G1",
    period: "2026-1",
    schedule: [
      { day: "lunes", startTime: "08:00", endTime: "10:00", classroom: "Lab 3" },
      { day: "miercoles", startTime: "08:00", endTime: "10:00", classroom: "Lab 3" }
    ],
    isActive: true
  },
  {
    _id: "course-bd2",
    code: "BD2-G1-2026-1",
    subject: { _id: "sub-bd2", code: "BD2", name: "Base de Datos II" },
    career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" },
    teacher: { firstName: "Carlos", lastName: "Mendez", code: "DOC-002" },
    parallel: "G1",
    period: "2026-1",
    schedule: [
      { day: "martes", startTime: "10:00", endTime: "12:00", classroom: "Aula 204" }
    ],
    isActive: true
  },
  {
    _id: "course-prog3",
    code: "PROG3-G2-2026-1",
    subject: { _id: "sub-prog3", code: "PROG3", name: "Programacion III" },
    career: { _id: "career-sis", code: "SIS", name: "Ingenieria de Sistemas" },
    teacher: { firstName: "Ana", lastName: "Rojas", code: "DOC-001" },
    parallel: "G2",
    period: "2026-1",
    schedule: [
      { day: "viernes", startTime: "14:00", endTime: "16:00", classroom: "Lab 1" }
    ],
    isActive: true
  }
];

const INITIAL_MOCK_AUDIT = [
  {
    _id: "audit-001",
    actor: { firstName: "Ricardo", lastName: "Nunez del Prado", role: "estudiante", code: "EST-2026-001", username: "ricardo_np" },
    action: "crear_solicitud",
    entityType: "Request",
    entityId: "req-001",
    metadata: { status: "pendiente", mode: "permiso_anticipado" },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "audit-002",
    actor: { firstName: "Christian", lastName: "Montano", role: "director", code: "DIR-SIS-001", username: "director_sistemas" },
    action: "observar_solicitud",
    entityType: "Request",
    entityId: "req-002",
    metadata: { status: "observado", comment: "Adjuntar certificado medico legible." },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
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
    const formatted = MOCK_USERS.map((u, i) => ({
      _id: `usr-${u.username}`,
      id: `usr-${u.username}`,
      ...u,
      isActive: true,
      career: u.role !== "administrador" ? { _id: "career-sis", name: "Ingenieria de Sistemas", code: "SIS" } : undefined
    }));
    localStorage.setItem("sigepej_mock_users", JSON.stringify(formatted));
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

function getMockNotifications() {
  return JSON.parse(localStorage.getItem("sigepej_mock_notifications"));
}

function saveMockNotifications(notifications) {
  localStorage.setItem("sigepej_mock_notifications", JSON.stringify(notifications));
}

function getMockUsers() {
  return JSON.parse(localStorage.getItem("sigepej_mock_users"));
}

function saveMockUsers(users) {
  localStorage.setItem("sigepej_mock_users", JSON.stringify(users));
}

function getMockCareers() {
  return JSON.parse(localStorage.getItem("sigepej_mock_careers"));
}

function saveMockCareers(careers) {
  localStorage.setItem("sigepej_mock_careers", JSON.stringify(careers));
}

function getMockSubjects() {
  return JSON.parse(localStorage.getItem("sigepej_mock_subjects"));
}

function saveMockSubjects(subjects) {
  localStorage.setItem("sigepej_mock_subjects", JSON.stringify(subjects));
}

function getMockCourses() {
  return JSON.parse(localStorage.getItem("sigepej_mock_courses"));
}

function saveMockCourses(courses) {
  localStorage.setItem("sigepej_mock_courses", JSON.stringify(courses));
}

function getMockAudit() {
  return JSON.parse(localStorage.getItem("sigepej_mock_audit"));
}

function saveMockAudit(audit) {
  localStorage.setItem("sigepej_mock_audit", JSON.stringify(audit));
}

function addMockAuditLog(action, entityType, entityId, metadata) {
  const audit = getMockAudit();
  const currentUser = JSON.parse(localStorage.getItem("sigepej_user")) || { firstName: "Admin", lastName: "SIGEPEJ", role: "administrador", code: "ADM-001", username: "admin" };
  audit.unshift({
    _id: `audit-${Date.now()}`,
    actor: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      role: currentUser.role,
      code: currentUser.code,
      username: currentUser.username
    },
    action,
    entityType,
    entityId,
    metadata,
    createdAt: new Date().toISOString()
  });
  saveMockAudit(audit);
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
      throw new Error(errData.message || "Error al iniciar sesion");
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

      throw new Error("Credenciales incorrectas. Verifique su usuario y contrasena.");
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
      if (response.ok) return await response.json();
      throw new Error("API error fetching requests");
    } catch (error) {
      console.warn("Backend getMyRequests failed, using mock data:", error.message);
      const requests = getMockRequests();
      return requests.filter((r) => r.requesterUsername === username);
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
      if (response.ok) return await response.json();
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
      if (response.ok) return await response.json();
      throw new Error("API error appealing request");
    } catch (error) {
      console.warn("Backend appealRequest failed, updating mock data:", error.message);

      const requests = getMockRequests();
      const idx = requests.findIndex(r => r.id === id || r.code === id);
      if (idx !== -1) {
        requests[idx].status = "pendiente";
        requests[idx].reasonDetail = `${requests[idx].reasonDetail}\n[APELACION]: ${justification}`;
        requests[idx].reviewComment = "";
        saveMockRequests(requests);
        return { ok: true, request: requests[idx] };
      }
      throw new Error("Solicitud no encontrada en mock DB");
    }
  },

  // Notifications
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
      // Get from localStorage
      const notifications = getMockNotifications();
      return notifications;
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
      console.warn("Backend markNotificationAsRead failed:", error.message);
      // Update in localStorage
      const notifications = getMockNotifications();
      const notif = notifications.find(n => n._id === notificationId);
      if (notif) {
        notif.read = true;
        notif.readAt = new Date().toISOString();
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
      console.warn("Backend markAllNotificationsAsRead failed:", error.message);
      // Update all in localStorage
      const notifications = getMockNotifications();
      notifications.forEach(n => {
        n.read = true;
        n.readAt = new Date().toISOString();
      });
      saveMockNotifications(notifications);
      return { message: "Mock: all marked as read" };
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
      console.warn("Backend getUnreadCount failed:", error.message);
      // Count from localStorage
      const notifications = getMockNotifications();
      return notifications.filter(n => !n.read).length;
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
      console.warn("Backend deleteNotification failed:", error.message);
      // Delete from localStorage
      const notifications = getMockNotifications();
      const filtered = notifications.filter(n => n._id !== notificationId);
      saveMockNotifications(filtered);
      return { message: "Mock: notification deleted" };
    }
  },

  // Users APIs
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
      
      const existing = users.find(u => u.username === userData.username || u.email === userData.email);
      if (existing) throw new Error("El usuario o correo electrónico ya está registrado");

      const newUser = {
        _id: `usr-${userData.username}`,
        id: `usr-${userData.username}`,
        ...userData,
        isActive: true
      };

      if (userData.career) {
        const careers = getMockCareers();
        newUser.career = careers.find(c => c._id === userData.career || c.code === userData.career) || { _id: userData.career, name: "Carrera Seleccionada" };
      }

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
      const idx = users.findIndex(u => u._id === userId || u.id === userId);
      if (idx !== -1) {
        const oldRole = users[idx].role;
        users[idx].role = role;
        saveMockUsers(users);
        addMockAuditLog("cambiar_rol", "User", userId, { username: users[idx].username, oldRole, newRole: role });
        return users[idx];
      }
      throw new Error("Usuario no encontrado en mock DB");
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
      const idx = users.findIndex(u => u._id === userId || u.id === userId);
      if (idx !== -1) {
        users[idx].isActive = isActive;
        saveMockUsers(users);
        addMockAuditLog(isActive ? "desbloquear_usuario" : "bloquear_usuario", "User", userId, { username: users[idx].username });
        return users[idx];
      }
      throw new Error("Usuario no encontrado en mock DB");
    }
  },

  // Catalogs APIs
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
      const existing = careers.find(c => c.code === careerData.code.toUpperCase());
      if (existing) throw new Error("Ya existe una carrera con ese código");

      const newCareer = {
        _id: `career-${Date.now()}`,
        code: careerData.code.toUpperCase().trim(),
        name: careerData.name,
        director: careerData.director ? { firstName: "Director", lastName: "Academico", code: careerData.director } : undefined,
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
      const existing = subjects.find(s => s.code === subjectData.code.toUpperCase());
      if (existing) throw new Error("Ya existe una materia con ese código");

      const careers = getMockCareers();
      const newSubject = {
        _id: `sub-${Date.now()}`,
        code: subjectData.code.toUpperCase().trim(),
        name: subjectData.name,
        career: careers.find(c => c._id === subjectData.career || c.code === subjectData.career) || { name: "Carrera" },
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
      const existing = courses.find(c => c.code === courseData.code.toUpperCase());
      if (existing) throw new Error("Ya existe un curso/paralelo con ese código");

      const subjects = getMockSubjects();
      const careers = getMockCareers();

      const newCourse = {
        _id: `course-${Date.now()}`,
        code: courseData.code.toUpperCase().trim(),
        subject: subjects.find(s => s._id === courseData.subject) || { name: "Materia" },
        career: careers.find(c => c._id === courseData.career) || { name: "Carrera" },
        teacher: { firstName: "Docente", lastName: "Asignado", code: courseData.teacher },
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

  // Audit Logs APIs
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

  // Reports/Stats APIs
  async getReportStats() {
    try {
      const response = await fetch(`${API_URL}/reports/stats`, {
        headers: getHeaders()
      });
      if (response.ok) return await response.json();
      throw new Error("API error fetching report stats");
    } catch (error) {
      console.warn("Backend getReportStats failed, using mock data:", error.message);
      
      const users = getMockUsers();
      const requests = getMockRequests();
      
      const pending = requests.filter(r => r.status === "pendiente").length;
      const approved = requests.filter(r => r.status === "aprobado" || r.status === "aprobada").length;
      const observed = requests.filter(r => r.status === "observado" || r.status === "observada").length;
      const rejected = requests.filter(r => r.status === "rechazado" || r.status === "rechazada").length;

      const healthCount = requests.filter(r => r.reasonType === "salud").length;
      const academicCount = requests.filter(r => r.reasonType === "academico").length;
      const personalCount = requests.filter(r => r.reasonType === "personal").length;
      const otherCount = requests.filter(r => r.reasonType === "otros").length;

      return {
        summary: {
          totalUsers: users.length,
          pendingRequests: pending,
          approvedRequests: approved,
          observedRequests: observed,
          rejectedRequests: rejected,
          totalRequests: requests.length,
          attendanceRate: 88, // static mock percentage for offline
          licenseRecords: 5
        },
        requestsByReason: [
          { name: "Salud", value: healthCount },
          { name: "Académico", value: academicCount },
          { name: "Personal", value: personalCount },
          { name: "Otros", value: otherCount }
        ]
      };
    }
  }
};
