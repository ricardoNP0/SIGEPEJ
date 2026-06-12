// backend/src/routes/attendanceRoutes.js
import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET - Docente consulta asistencia por curso y fecha
router.get(
  '/',
  roleMiddleware(['docente', 'director', 'secretario']),
  attendanceController.getAttendanceByCourseAndDate
);

// PATCH - Docente marca asistencia (usando recordId)
router.patch(
  '/:recordId',
  roleMiddleware(['docente']),
  attendanceController.updateAttendance
);

// EXTRA - Director modifica licencia bloqueada
router.patch(
  '/unlock/:recordId',
  roleMiddleware(['director']),
  attendanceController.unlockAttendanceByDirector
);

export default router;