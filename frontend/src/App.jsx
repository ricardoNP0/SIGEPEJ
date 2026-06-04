const roles = [
  "Estudiante",
  "Docente",
  "Director de Carrera",
  "Secretario Académico",
  "Administrador",
];

const modules = [
  "Autenticación por roles",
  "Solicitudes de ausencia",
  "Revisión y aprobación",
  "Asistencia P/F/L",
  "Notificaciones",
  "Auditoría",
  "Reportes",
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand">
          <span className="brand-mark">UV</span>
          <div>
            <strong>SIGEPEJ</strong>
            <small>Sistema de Gestión de Solicitudes de Ausencia</small>
          </div>
        </div>
        <div className="hero-copy">
          <h1>Base frontend lista para trabajar.</h1>
          <p>
            Esta pantalla solo confirma que React y Vite arrancan correctamente.
            Las pantallas reales deben implementarse desde el mockup ubicado en
            la carpeta preview.
          </p>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>Roles del sistema</h2>
          <div className="list">
            {roles.map((role) => (
              <span key={role} className="chip">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Módulos pendientes</h2>
          <ul>
            {modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </div>

        <div className="panel full">
          <h2>Conexión backend</h2>
          <p>
            API configurada en <code>{import.meta.env.VITE_API_URL}</code>.
            Probar el backend en <code>http://localhost:5000/api/health</code>.
          </p>
        </div>
      </section>
    </main>
  );
}
