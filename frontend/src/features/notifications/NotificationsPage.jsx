import { useEffect, useState } from "react";
import apiClient from "../../api/client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data =
        await apiClient.getNotifications();

      setNotifications(
        data.notifications || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const markRead = async (id) => {
    try {
      await apiClient.markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                read: true,
                readAt: new Date()
              }
            : item
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  const unread =
    notifications.filter(
      (n) => !n.read
    );

  const read =
    notifications.filter(
      (n) => n.read
    );

  const renderCard = (item) => (
    <div
      key={item._id}
      className="card"
      style={{
        marginBottom: "12px"
      }}
    >
      <h4>{item.title}</h4>

      <p>{item.message}</p>

      <small>
        {new Date(
          item.createdAt
        ).toLocaleString()}
      </small>

      {!item.read && (
        <div
          style={{
            marginTop: "8px"
          }}
        >
          <button
            onClick={() =>
              markRead(item._id)
            }
          >
            Marcar como leída
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1>Notificaciones</h1>

      <h2>
        No leídas ({unread.length})
      </h2>

      {unread.map(renderCard)}

      <h2
        style={{
          marginTop: "32px"
        }}
      >
        Leídas ({read.length})
      </h2>

      {read.map(renderCard)}
    </div>
  );
}
