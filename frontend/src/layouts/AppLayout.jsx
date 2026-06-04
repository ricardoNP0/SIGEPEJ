import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck2,
  ClipboardCheck,
  FilePlus2,
  FileText,
  Gauge,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import { menuByRole, roleOptions, usersByRole } from "../routes/menuConfig.js";

const icons = {
  dashboard: Gauge,
  request: FilePlus2,
  history: FileText,
  teacher: BookOpen,
  review: ClipboardCheck,
  attendance: CalendarCheck2,
  notifications: Bell,
  reports: BarChart3,
  catalogs: UsersRound,
  users: UserCog,
  audit: ShieldCheck,
};

export function AppLayout() {
  const [activeRole, setActiveRole] = useState("estudiante");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = menuByRole[activeRole];
  const currentUser = usersByRole[activeRole];

  const currentTitle = useMemo(() => {
    const found = Object.values(menuByRole)
      .flat()
      .find((item) => item.path === location.pathname);

    return found?.label ?? "Panel";
  }, [location.pathname]);

  useEffect(() => {
    const allowed = menuItems.some((item) => item.path === location.pathname);

    if (!allowed && location.pathname !== "/dashboard") {
      navigate(menuItems[0].path, { replace: true });
    }
  }, [activeRole, location.pathname, menuItems, navigate]);

  function handleRoleChange(event) {
    const nextRole = event.target.value;
    setActiveRole(nextRole);
    navigate(menuByRole[nextRole][0].path);
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <div className="brand">
            <span className="brand-mark">UV</span>
            <div>
              <strong>SIGEPEJ</strong>
              <small>Ausencias y asistencia</small>
            </div>
          </div>
          <button
            className="icon-button mobile-only"
            type="button"
            aria-label="Cerrar menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="role-picker">
          <label htmlFor="active-role">Rol activo</label>
          <select id="active-role" value={activeRole} onChange={handleRoleChange}>
            {roleOptions.map((role) => (
              <option value={role.value} key={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <nav className="nav-list" aria-label="Menu principal">
          {menuItems.map((item) => {
            const Icon = icons[item.icon];
            return (
              <NavLink
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                to={item.path}
                key={item.path}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="user-block">
            <span>{currentUser.initials}</span>
            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>
          </div>
          <NavLink className="logout-link" to="/login">
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesion
          </NavLink>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-only"
            type="button"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          <div>
            <span className="topbar-kicker">Modulo actual</span>
            <h1>{currentTitle}</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <input type="search" placeholder="Buscar solicitud, materia o usuario" />
            </label>
            <button className="icon-button" type="button" aria-label="Ver notificaciones">
              <Bell size={20} aria-hidden="true" />
              <span className="notification-dot" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
