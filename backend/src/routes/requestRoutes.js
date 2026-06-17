import { Router } from "express";

import {
  createRequest,
  uploadRequestEvidence,
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

export default router;
