import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { ArrowRight, Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await apiClient.login(usernameOrEmail.trim(), password);
      login(data.token, data.user);

      // Role redirect logic matching Sprint 1 specifications
      const role = data.user.role;
      if (role === "estudiante") {
        navigate("/mis-solicitudes");
      } else if (role === "docente") {
        navigate("/asistencia");
      } else if (role === "director") {
        navigate("/revision");
      } else if (role === "secretario") {
        navigate("/revision");
      } else if (role === "administrador") {
        navigate("/usuarios");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Fallo en el inicio de sesión. Verifique sus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-panel" style={{ padding: "32px", width: "420px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <span className="brand-mark" style={{ fontSize: "20px", width: "50px", height: "50px" }}>UV</span>
        </div>
        
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span className="eyebrow">Acceso al Sistema</span>
          <h1 style={{ fontSize: "24px", margin: "4px 0" }}>SIGEPEJ</h1>
          <p style={{ fontSize: "14px", margin: "4px 0 0" }}>
            Gestión de Solicitudes de Ausencia
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "16px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label" htmlFor="username">Usuario o Correo</label>
            <div style={{ position: "relative" }}>
              <User 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ink-500)" }} 
              />
              <input
                id="username"
                type="text"
                placeholder="Ej. ricardo_np o ana.rojas@univalle.edu"
                className="form-input"
                style={{ paddingLeft: "38px" }}
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div style={{ position: "relative" }}>
              <Lock 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ink-500)" }} 
              />
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                className="form-input"
                style={{ paddingLeft: "38px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </section>
    </main>
  );
}
