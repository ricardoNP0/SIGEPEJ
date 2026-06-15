import { Router } from "express";
<<<<<<< HEAD
import { login, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
=======
import { login } from "../controllers/authController.js";
>>>>>>> main

const router = Router();

router.post("/login", login);
<<<<<<< HEAD
router.get("/me", authMiddleware, getMe);
=======
>>>>>>> main

export default router;
