import { Router } from "express";
import * as resumeController from "../controllers/resumeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createResumeSchema,
  updateResumeSchema,
  queryResumeSchema,
} from "../validators/resumeValidator.js";

const router = Router();

// Seluruh rute resume dilindungi oleh requireAuth
router.use(requireAuth);

router.get("/", validate(queryResumeSchema, "query"), resumeController.getResumes);
router.post("/", validate(createResumeSchema), resumeController.createResume);
router.get("/:id", resumeController.getResume);
router.put("/:id", validate(updateResumeSchema), resumeController.updateResume);
router.post("/:id/duplicate", resumeController.duplicateResume);
router.delete("/:id", resumeController.deleteResume);

export default router;
