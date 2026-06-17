import { Router } from "express";
import {
  getCareers,
  createCareer,
  getSubjects,
  createSubject,
  getCourses,
  createCourse,
} from "../controllers/catalogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Secretaria y administrador gestionan catalogos; director puede consultarlos.
router.use(authMiddleware);

router.get("/careers", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY, ROLES.DIRECTOR]), getCareers);
router.post("/careers", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY]), createCareer);

router.get("/subjects", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY, ROLES.DIRECTOR]), getSubjects);
router.post("/subjects", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY]), createSubject);

router.get("/courses", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY, ROLES.DIRECTOR]), getCourses);
router.post("/courses", roleMiddleware([ROLES.ADMIN, ROLES.SECRETARY]), createCourse);

export default router;
