import { Router } from "express";
import * as resumeController from "../controllers/resumeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createResumeSchema,
  updateResumeSchema,
  queryResumeSchema,
  resumeParamSchema,
} from "../validators/resumeValidator.js";
import { resumeMutationLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

// Seluruh rute resume dilindungi oleh requireAuth
router.use(requireAuth);

router.get("/", validate(queryResumeSchema, "query"), resumeController.getResumes);
router.post("/", resumeMutationLimiter, validate(createResumeSchema), resumeController.createResume);
router.get("/:id", validate(resumeParamSchema, "params"), resumeController.getResume);
router.put(
  "/:id",
  resumeMutationLimiter,
  validate(resumeParamSchema, "params"),
  validate(updateResumeSchema),
  resumeController.updateResume
);
router.post(
  "/:id/duplicate",
  resumeMutationLimiter,
  validate(resumeParamSchema, "params"),
  resumeController.duplicateResume
);
router.delete(
  "/:id",
  resumeMutationLimiter,
  validate(resumeParamSchema, "params"),
  resumeController.deleteResume
);

export default router;
