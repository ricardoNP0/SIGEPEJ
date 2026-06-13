import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Todas las rutas requieren login y rol de administrador
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN]));

router.get("/", getAuditLogs);

export default router;
