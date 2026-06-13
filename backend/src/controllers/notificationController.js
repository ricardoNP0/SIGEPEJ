import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

// GET - Get all notifications for authenticated user
export async function getNotifications(req, res) {
  try {
    // Try to get from MongoDB first
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      notifications: notifications || [],
      unreadCount: notifications.filter(n => !n.read).length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Error al obtener notificaciones" });
  }
}

// PATCH - Mark notification as read
export async function markNotificationAsRead(req, res) {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      {
        read: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    return res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Error al marcar como leída" });
  }
}

// PATCH - Mark all notifications as read
export async function markAllNotificationsAsRead(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const result = await Notification.updateMany(
      { user: userId, read: false },
      {
        read: true,
        readAt: new Date(),
      }
    );

    return res.json({
      message: "Todas las notificaciones marcadas como leídas",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({ message: "Error al marcar notificaciones" });
  }
}

// DELETE - Delete a notification
export async function deleteNotification(req, res) {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!result) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    return res.json({ message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Error al eliminar notificación" });
  }
}

// GET - Get unread count
export async function getUnreadCount(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return res.json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return res.status(500).json({ message: "Error al obtener contador" });
  }
}
