import { Router } from "express";

import {
  createRequest,
  appealRejectedRequest,
  getMyRequests,
  listRequests,
  reviewRequest,
  updateObservedRequest,
  uploadRequestEvidence,
} from "../controllers/requestController.js";

import {
  uploadEvidence,
} from "../services/uploadService.js";
import { ROLES } from "../constants/roles.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", roleMiddleware([ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY]), listRequests);
router.get("/my", getMyRequests);
router.post(
  "/",
  roleMiddleware([ROLES.STUDENT, ROLES.TEACHER]),
  uploadEvidence.single("evidence"),
  createRequest
);
router.put(
  "/:requestId",
  roleMiddleware([ROLES.STUDENT, ROLES.TEACHER]),
  uploadEvidence.single("evidence"),
  updateObservedRequest
);
router.post(
  "/:requestId/appeal",
  roleMiddleware([ROLES.STUDENT, ROLES.TEACHER]),
  appealRejectedRequest
);
router.patch(
  "/:requestId/review",
  roleMiddleware([ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY]),
  reviewRequest
);

router.post(
  "/:requestId/evidence",
  roleMiddleware([ROLES.STUDENT, ROLES.TEACHER]),
  uploadEvidence.single("evidence"),
  uploadRequestEvidence
);

export default router;
