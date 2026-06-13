import { Router } from "express";
import { getUsers, createUser, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Todas las rutas requieren login y rol de administrador
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN]));

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:userId/role", updateUserRole);
router.patch("/:userId/status", updateUserStatus);

export default router;
