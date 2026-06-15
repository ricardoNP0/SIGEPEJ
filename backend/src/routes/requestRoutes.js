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

const router = Router();

router.get("/", listRequests);
router.get("/my", getMyRequests);
router.post("/", uploadEvidence.single("evidence"), createRequest);
router.put("/:requestId", uploadEvidence.single("evidence"), updateObservedRequest);
router.post("/:requestId/appeal", appealRejectedRequest);
router.patch("/:requestId/review", reviewRequest);

router.post(
  "/:requestId/evidence",
  uploadEvidence.single("evidence"),
  uploadRequestEvidence
);

export default router;
