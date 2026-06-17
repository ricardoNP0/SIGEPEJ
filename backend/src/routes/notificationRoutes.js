import { Router } from "express";

import { authMiddleware }
  from "../middlewares/authMiddleware.js";

import {
  getNotifications,
  markNotificationRead
} from "../controllers/notificationController.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationRead
);

export default router;
