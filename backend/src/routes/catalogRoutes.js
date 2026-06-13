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

// Todas las rutas requieren login y rol de administrador
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN]));

router.get("/careers", getCareers);
router.post("/careers", createCareer);

router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);

router.get("/courses", getCourses);
router.post("/courses", createCourse);

export default router;
