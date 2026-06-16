import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { ROLES } from "../constants/roles.js";
import {
  createRequest,
  uploadRequestEvidence,
  getRequests,
  reviewRequest,
  correctObservedRequest,
  appealRequest
} from "../controllers/requestController.js";
import {
  uploadEvidence,
} from "../services/uploadService.js";

const router = Router();

router.post("/", uploadEvidence.single("evidence"), createRequest);

router.post(
  "/:requestId/evidence",
  uploadEvidence.single("evidence"),
  uploadRequestEvidence
);
router.get("/", getRequests);

router.patch(
  "/:id/review",
  authMiddleware,
  requireRole(ROLES.DIRECTOR),
  reviewRequest
);
router.patch(
  "/:id/correct",
  authMiddleware,
  uploadEvidence.single("evidence"),
  correctObservedRequest
);
router.patch(
  "/:id/appeal",
  authMiddleware,
  uploadEvidence.single("evidence"),
  appealRequest
);
export default router;