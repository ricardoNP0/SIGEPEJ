import { Router } from "express";
import { getReportStats } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Reportes visibles para administracion y responsables academicos.
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY]));

router.get("/stats", getReportStats);

export default router;
