// backend/src/routes/notificationRoutes.js
import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET - Get all notifications for authenticated user
router.get('/', notificationController.getNotifications);

// GET - Get unread count
router.get('/unread/count', notificationController.getUnreadCount);

// PATCH - Mark notification as read
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);

// PATCH - Mark all notifications as read
router.patch('/read/all', notificationController.markAllNotificationsAsRead);

// DELETE - Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

export default router;
