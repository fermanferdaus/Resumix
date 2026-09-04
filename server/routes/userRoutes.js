import express, { Router } from "express";
import * as userController from "../controllers/userController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  updateProfileSchema,
  uploadAvatarSchema,
} from "../validators/userValidator.js";
import { avatarUploadLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

// Seluruh rute user profile dilindungi oleh requireAuth
router.use(requireAuth);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.post(
  "/avatar",
  avatarUploadLimiter,
  express.json({ limit: "4mb" }),
  validate(uploadAvatarSchema),
  userController.uploadAvatar
);
router.delete("/avatar", userController.deleteAvatar);

export default router;
