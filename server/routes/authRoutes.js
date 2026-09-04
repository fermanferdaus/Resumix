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

import {
  authStrictLimiter,
  authSendLimiter,
  authGeneralLimiter,
  refreshLimiter,
} from "../middlewares/rateLimitMiddleware.js";

const router = Router();

// Public Routes
router.post("/check-email", authGeneralLimiter, validate(checkEmailSchema), authController.checkEmail);
router.post("/send-otp", authSendLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post("/verify-otp", authStrictLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post("/register", authGeneralLimiter, validate(registerSchema), authController.register);
router.post("/login", authStrictLimiter, validate(loginSchema), authController.login);
router.post("/2fa/verify", authStrictLimiter, authController.verify2FA);
router.post("/google", authGeneralLimiter, validate(googleAuthSchema), authController.googleAuth);
router.post("/forgot-password", authSendLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authStrictLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post("/refresh-token", refreshLimiter, authController.refreshToken);
router.post("/logout", authController.logout);

// Protected Routes
router.get("/me", requireAuth, authController.getMe);

export default router;
