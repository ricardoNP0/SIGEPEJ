import { Router } from "express";
import { getMe, login } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);

export default router;
