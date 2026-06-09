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

// Initialize mock DB in localStorage
function initMockDb() {
  if (!localStorage.getItem("sigepej_mock_requests")) {
    localStorage.setItem("sigepej_mock_requests", JSON.stringify(INITIAL_MOCK_REQUESTS));
  }
}
initMockDb();

function getMockRequests() {
  return JSON.parse(localStorage.getItem("sigepej_mock_requests"));
}

function saveMockRequests(requests) {
  localStorage.setItem("sigepej_mock_requests", JSON.stringify(requests));
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
        body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password })
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
  }
};
