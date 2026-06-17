import { Notification } from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      (item) => !item.read
    ).length;

    return res.json({
      success: true,
      unreadCount,
      notifications
    });

  } catch (error) {
    console.error("Error getNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener notificaciones"
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada"
      });
    }

    if (
      notification.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "No autorizado"
      });
    }

    notification.read = true;
    notification.readAt = new Date();

    await notification.save();

    return res.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error(
      "Error markNotificationRead:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error al marcar notificación"
    });
  }
};
