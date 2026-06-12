import { Router } from "express";

import {
  createRequest,
  uploadRequestEvidence,
  getRequests,
  reviewRequest
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

router.patch("/:id/review", reviewRequest);
export default router;