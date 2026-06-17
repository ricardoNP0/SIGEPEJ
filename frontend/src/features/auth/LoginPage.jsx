import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiClient } from "../../api/client.js";
import { ArrowRight, Lock, User, AlertCircle, X, MailQuestion, Send } from "lucide-react";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState({ fullName: "", username: "", email: "" });
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
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

          <button
            type="button"
            onClick={() => setShowRecovery(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--uv-gold-500)",
              cursor: "pointer",
              fontSize: "13px",
              marginTop: "12px",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            ¿Olvidó su contraseña?
          </button>
        </form>
      </section>

      {showRecovery && (
        <div className="modal-overlay" onClick={() => setShowRecovery(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "min(420px, 90vw)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Recuperar Contraseña</h2>
              <button onClick={() => setShowRecovery(false)} className="btn-icon-danger" style={{ padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            {recoveryMsg && (
              <div className="alert alert-success" style={{ marginBottom: "12px" }}>
                <MailQuestion size={18} />
                <span>{recoveryMsg}</span>
              </div>
            )}
            {recoveryError && (
              <div className="alert alert-error" style={{ marginBottom: "12px" }}>
                <AlertCircle size={18} />
                <span>{recoveryError}</span>
              </div>
            )}

            {!recoveryMsg ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setRecoveryMsg("");
                setRecoveryError("");
                if (!recoveryForm.fullName.trim() || !recoveryForm.username.trim() || !recoveryForm.email.trim()) {
                  setRecoveryError("Por favor, complete todos los campos.");
                  return;
                }
                setRecoverySubmitting(true);
                try {
                  await apiClient.createPasswordResetRequest(recoveryForm);
                  setRecoveryMsg("Solicitud enviada. Recibirá una notificación cuando un administrador, secretario o director de carrera apruebe el restablecimiento.");
                  setRecoveryForm({ fullName: "", username: "", email: "" });
                } catch (err) {
                  setRecoveryError(err.message);
                } finally {
                  setRecoverySubmitting(false);
                }
              }}>
                <p style={{ fontSize: "13px", margin: "0 0 16px", color: "var(--ink-500)", lineHeight: "1.5" }}>
                  Ingrese sus datos para solicitar el restablecimiento de contraseña. Un administrador, secretario o director de carrera revisará y aprobará su solicitud.
                </p>
                <div className="form-group">
                  <label className="form-label" htmlFor="recFullName">Nombre completo</label>
                  <input
                    id="recFullName"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej. Ricardo Núñez del Prado"
                    value={recoveryForm.fullName}
                    onChange={(e) => setRecoveryForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label" htmlFor="recUsername">Nombre de usuario</label>
                  <input
                    id="recUsername"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej. ricardo_np"
                    value={recoveryForm.username}
                    onChange={(e) => setRecoveryForm(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label" htmlFor="recEmail">Correo electrónico</label>
                  <input
                    id="recEmail"
                    type="email"
                    required
                    className="form-input"
                    placeholder="Ej. ricardo.nunez@univalle.edu"
                    value={recoveryForm.email}
                    onChange={(e) => setRecoveryForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-actions" style={{ borderTop: "1px solid var(--line)", marginTop: "20px", paddingTop: "14px" }}>
                  <button type="button" className="btn-secondary" onClick={() => { setShowRecovery(false); setRecoveryMsg(""); setRecoveryError(""); }}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={recoverySubmitting}>
                    {recoverySubmitting ? "Enviando..." : <><Send size={16} /> Enviar solicitud</>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="form-actions" style={{ borderTop: "1px solid var(--line)", marginTop: "12px", paddingTop: "14px" }}>
                <button type="button" className="btn-primary" style={{ width: "100%" }} onClick={() => { setShowRecovery(false); setRecoveryMsg(""); setRecoveryError(""); }}>
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
