import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Auditoria visible para administracion y responsables academicos.
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY]));

router.get("/", getAuditLogs);

export default router;
