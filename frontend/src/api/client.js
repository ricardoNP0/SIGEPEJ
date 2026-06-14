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
      throw new Error("No se puede modificar una licencia bloqueada por Direccion.");
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
  }
};
