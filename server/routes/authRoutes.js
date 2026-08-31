import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  checkEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = Router();

// Public Routes
router.post("/check-email", validate(checkEmailSchema), authController.checkEmail);
router.post("/send-otp", validate(sendOtpSchema), authController.sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/google", validate(googleAuthSchema), authController.googleAuth);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

// Protected Routes
router.get("/me", requireAuth, authController.getMe);

export default router;
