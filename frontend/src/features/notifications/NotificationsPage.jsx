import { useEffect, useState, useContext } from "react";
import { apiClient } from "../../api/client.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Bell, Check, Trash2, Clock } from "lucide-react";
import "../../styles/global.css";

export default function NotificationsPage() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, [token]);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await apiClient.getNotifications();
      setNotifications(data);
      setError("");
    } catch (err) {
      setError("Error al cargar notificaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId, currentRead) {
    if (currentRead) return; // Already read

    try {
      await apiClient.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
          readAt: new Date().toISOString(),
        }))
      );
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  }

  async function handleDelete(notificationId) {
    try {
      await apiClient.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "solicitud":
        return "bg-blue-100 text-blue-800";
      case "revision":
        return "bg-orange-100 text-orange-800";
      case "asistencia":
        return "bg-green-100 text-green-800";
      case "sistema":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "solicitud":
        return "Solicitud";
      case "revision":
        return "Revisión";
      case "asistencia":
        return "Asistencia";
      case "sistema":
        return "Sistema";
      default:
        return "Notificación";
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Notificaciones</h1>
        </div>
        <div className="page-content" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-secondary)" }}>Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Bell size={24} />
            <h1>Notificaciones</h1>
          </div>
          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--uv-gold-500)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Marcar todo como leído
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "6px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-secondary)",
            }}
          >
            <Bell size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <>
            {/* No leídas */}
            {unreadNotifications.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    opacity: 0.7,
                  }}
                >
                  No leídas ({unreadNotifications.length})
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {unreadNotifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkAsRead(notif._id, notif.read)}
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--background-secondary)",
                        borderLeft: "4px solid var(--uv-gold-500)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              margin: 0,
                            }}
                          >
                            {notif.title}
                          </h3>
                          <span
                            className={getTypeColor(notif.type)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {getTypeLabel(notif.type)}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            margin: "4px 0 8px 0",
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.message}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          <Clock size={12} />
                          {formatDate(notif.createdAt)}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif._id, notif.read);
                          }}
                          style={{
                            padding: "6px 8px",
                            backgroundColor: "transparent",
                            border: "1px solid var(--uv-gold-500)",
                            color: "var(--uv-gold-500)",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--uv-gold-500)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "var(--uv-gold-500)";
                          }}
                          title="Marcar como leída"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif._id);
                          }}
                          style={{
                            padding: "6px 8px",
                            backgroundColor: "transparent",
                            border: "1px solid #e74c3c",
                            color: "#e74c3c",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#e74c3c";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#e74c3c";
                          }}
                          title="Eliminar notificación"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leídas */}
            {readNotifications.length > 0 && (
              <div>
                <h2
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    opacity: 0.7,
                  }}
                >
                  Leídas ({readNotifications.length})
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {readNotifications.map((notif) => (
                    <div
                      key={notif._id}
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--background-secondary)",
                        borderLeft: "4px solid var(--text-tertiary)",
                        borderRadius: "6px",
                        opacity: 0.6,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = "0.6";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              margin: 0,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {notif.title}
                          </h3>
                          <span
                            className={getTypeColor(notif.type)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              opacity: 0.7,
                            }}
                          >
                            {getTypeLabel(notif.type)}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-tertiary)",
                            margin: "4px 0 8px 0",
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.message}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          <Clock size={12} />
                          {formatDate(notif.createdAt)}
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => handleDelete(notif._id)}
                          style={{
                            padding: "6px 8px",
                            backgroundColor: "transparent",
                            border: "1px solid #e74c3c",
                            color: "#e74c3c",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#e74c3c";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#e74c3c";
                          }}
                          title="Eliminar notificación"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
