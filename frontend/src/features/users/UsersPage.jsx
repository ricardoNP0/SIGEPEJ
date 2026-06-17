import { useState, useEffect } from "react";
import { apiClient } from "../../api/client.js";
import { roleOptions } from "../../routes/menuConfig.js";
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  RefreshCw,
  AlertCircle,
  X,
  Plus,
  ShieldAlert
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Create User Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "estudiante",
    code: "",
    career: "",
    phone: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersData, careersData] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getCareers()
      ]);
      setUsers(usersData);
      setCareers(careersData);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos de usuarios o carreras.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = !user.isActive;
    const actionText = nextStatus ? "desbloquear" : "bloquear";
    if (!confirm(`¿Está seguro de que desea ${actionText} el acceso al usuario ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      const updated = await apiClient.updateUserStatus(user._id || user.id, nextStatus);
      setUsers(prev => prev.map(u => (u._id === user._id || u.id === user.id) ? { ...u, isActive: updated.isActive } : u));
      setSuccess(`Usuario ${user.username} ${nextStatus ? "desbloqueado" : "bloqueado"} con éxito.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      alert("Error al cambiar el estado: " + err.message);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      const updated = await apiClient.updateUserRole(user._id || user.id, newRole);
      setUsers(prev => prev.map(u => (u._id === user._id || u.id === user.id) ? { ...u, role: updated.role } : u));
      setSuccess(`Rol de usuario ${user.username} cambiado a ${newRole} con éxito.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      alert("Error al cambiar el rol: " + err.message);
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);

    try {
      const created = await apiClient.createUser(formData);
      setUsers(prev => [created, ...prev]);
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        role: "estudiante",
        code: "",
        career: "",
        phone: ""
      });
      setSuccess("Usuario creado con éxito (la contraseña predeterminada es password123).");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setFormError(err.message || "Error al crear el usuario.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filters calculation
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName} ${user.username} ${user.email} ${user.code || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <section className="content-stack">
      <div className="page-heading">
        <span className="eyebrow">Administración</span>
        <h1>Usuarios y Roles</h1>
        <p>
          Administre las cuentas de estudiantes, docentes, directores y secretarios. Gestione accesos, asigne roles académicos y cree nuevos perfiles.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <UserCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="surface-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Control de Cuentas</span>
            <h2>Listado de Usuarios</h2>
          </div>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn-primary" 
              type="button"
              style={{ display: "inline-flex", gap: "6px" }}
            >
              <Plus size={16} />
              Crear Usuario
            </button>
            <button 
              onClick={loadData} 
              className="ghost-button" 
              type="button"
              disabled={loading}
              style={{ display: "inline-flex", gap: "6px" }}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", marginBottom: "20px" }}>
          <label className="search-box" style={{ width: "100%", maxWidth: "none" }}>
            <Search size={18} aria-hidden="true" />
            <input 
              type="search" 
              placeholder="Buscar por nombre, usuario, correo o código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>

          <select 
            className="form-select" 
            style={{ width: "200px" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos los Roles</option>
            {roleOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-500)" }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
            <p>Cargando listado de usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", border: "1px dashed var(--line)", borderRadius: "8px", background: "var(--surface-muted)" }}>
            <Users size={40} style={{ color: "var(--ink-300)", marginBottom: "12px" }} />
            <h3>No se encontraron usuarios</h3>
            <p style={{ color: "var(--ink-500)", margin: "4px 0" }}>
              Ningún usuario coincide con los filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Usuario y Datos</th>
                  <th>Contacto y Carrera</th>
                  <th>Código</th>
                  <th>Rol Asignado</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id || u.id} style={{ opacity: u.isActive ? 1 : 0.6 }}>
                    <td>
                      <strong>{u.firstName} {u.lastName}</strong>
                      <span style={{ fontSize: "12px", color: "var(--ink-500)" }}>@{u.username}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: "13px" }}>{u.email}</div>
                      <span style={{ fontSize: "12px", color: "var(--ink-500)" }}>
                        {u.career?.name || u.career || "Administración / Global"}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: "13px", padding: "2px 6px", background: "var(--surface-muted)", borderRadius: "4px" }}>
                        {u.code || "SIN CÓDIGO"}
                      </code>
                    </td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className="form-select"
                        style={{ padding: "4px 8px", fontSize: "13px", minHeight: "32px", width: "160px" }}
                      >
                        {roleOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`status-pill ${u.isActive ? "aprobada" : "observada"}`} style={{ display: "inline-block" }}>
                        {u.isActive ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn-secondary ${u.isActive ? "btn-danger" : ""}`}
                        style={{ padding: "6px 12px", minHeight: "32px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        {u.isActive ? "Bloquear" : "Desbloquear"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "min(600px, 90vw)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>
                Registrar Nuevo Usuario
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="btn-icon-danger" 
                style={{ padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">Nombres *</label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className="form-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Apellidos *</label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className="form-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Correo Electrónico *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="ejemplo@univalle.edu"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Nombre de Usuario *</label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="form-input"
                    placeholder="ej. ana_rojas"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="role">Rol en el Sistema *</label>
                  <select
                    id="role"
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="code">Código de Registro (SIS/Personal)</label>
                  <input
                    id="code"
                    type="text"
                    className="form-input"
                    placeholder="ej. EST-2026-009 o DOC-009"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="career">Carrera (para Estudiantes/Directores)</label>
                  <select
                    id="career"
                    className="form-select"
                    value={formData.career}
                    onChange={(e) => setFormData(prev => ({ ...prev, career: e.target.value }))}
                  >
                    <option value="">Sin carrera asignada</option>
                    {careers.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Teléfono / Celular</label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="ej. 78945612"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ borderTop: "1px solid var(--line)", marginTop: "20px", paddingTop: "14px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Registrando..." : "Registrar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
