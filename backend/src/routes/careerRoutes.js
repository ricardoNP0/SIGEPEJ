// backend/src/routes/careerRoutes.js
import express from 'express';
import * as careerController from '../controllers/careerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['administrador'])); // Solo admin

router.get('/', careerController.getCareers);
router.get('/:id', careerController.getCareerById);
router.post('/', careerController.createCareer);
router.put('/:id', careerController.updateCareer);
router.delete('/:id', careerController.deleteCareer);

export default router;