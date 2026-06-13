import { Router } from "express";
import { getMyCourses } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/my", authMiddleware, getMyCourses);

export default router;
