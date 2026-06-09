export const roleOptions = [
  { value: "estudiante", label: "Estudiante" },
  { value: "docente", label: "Docente" },
  { value: "director", label: "Director de Carrera" },
  { value: "secretario", label: "Secretario Academico" },
  { value: "admin", label: "Administrador" },
];

export const usersByRole = {
  estudiante: {
    initials: "AR",
    name: "Ana Rojas",
    role: "Estudiante",
  },
  docente: {
    initials: "CM",
    name: "Carlos Mendez",
    role: "Docente",
  },
  director: {
    initials: "DS",
    name: "Director Sistemas",
    role: "Director de Carrera",
  },
  secretario: {
    initials: "SS",
    name: "Secretaria Sistemas",
    role: "Secretario Academico",
  },
  admin: {
    initials: "AD",
    name: "Administrador",
    role: "Administrador",
  },
};

export const menuByRole = {
  estudiante: [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Nueva solicitud", path: "/nueva-solicitud", icon: "request" },
    { label: "Mis solicitudes", path: "/mis-solicitudes", icon: "history" },
    { label: "Notificaciones", path: "/notificaciones", icon: "notifications" },
  ],
  docente: [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Solicitud docente", path: "/solicitud-docente", icon: "teacher" },
    { label: "Asistencia", path: "/asistencia", icon: "attendance" },
    { label: "Notificaciones", path: "/notificaciones", icon: "notifications" },
  ],
  director: [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Revision", path: "/revision", icon: "review" },
    { label: "Asistencia", path: "/asistencia", icon: "attendance" },
    { label: "Reportes", path: "/reportes", icon: "reports" },
    { label: "Auditoria", path: "/auditoria", icon: "audit" },
  ],
  secretario: [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Revision", path: "/revision", icon: "review" },
    { label: "Catalogos", path: "/catalogos", icon: "catalogs" },
    { label: "Reportes", path: "/reportes", icon: "reports" },
    { label: "Notificaciones", path: "/notificaciones", icon: "notifications" },
  ],
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Usuarios", path: "/usuarios", icon: "users" },
    { label: "Catalogos", path: "/catalogos", icon: "catalogs" },
    { label: "Reportes", path: "/reportes", icon: "reports" },
    { label: "Auditoria", path: "/auditoria", icon: "audit" },
  ],
};
