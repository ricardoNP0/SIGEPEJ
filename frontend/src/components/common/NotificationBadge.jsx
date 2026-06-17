import { useEffect, useState } from "react";
import apiClient from "../../api/client";

export default function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data =
        await apiClient.getNotifications();

      setCount(
        data.unreadCount || 0
      );

    } catch (error) {
      console.error(error);
    }
  };

  if (count === 0) return null;

  return (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        background: "red",
        color: "white",
        borderRadius: "50%",
        minWidth: "18px",
        height: "18px",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {count}
    </span>
  );
}
