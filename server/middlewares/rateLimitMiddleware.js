import rateLimit from "express-rate-limit";

const FIVE_MINUTES = 5 * 60 * 1000;

/**
 * Helper untuk membuat generic rate limiter
 */
const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message,
        data: null,
        errors: null,
      });
    },
  });

/**
 * Helper untuk membuat combo IP + Email rate limiter
 */
const createComboLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase().trim() : "no-email";
      return `${req.ip}:${email}`;
    },
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message,
        data: null,
        errors: null,
      });
    },
  });

/**
 * Strict Rate Limiter: 5 percobaan / 5 menit (Login, Verify OTP, Reset Password)
 */
export const authStrictLimiter = createComboLimiter(
  FIVE_MINUTES,
  5,
  "Terlalu banyak percobaan. Silakan coba lagi dalam 5 menit."
);

/**
 * Send Limiter: 3 permintaan / 5 menit (Send OTP, Forgot Password)
 */
export const authSendLimiter = createComboLimiter(
  FIVE_MINUTES,
  3,
  "Terlalu banyak permintaan pengiriman kode. Silakan tunggu 5 menit."
);

/**
 * General Auth Limiter: 10 permintaan / 5 menit (Register, Check Email, Google Auth)
 */
export const authGeneralLimiter = createLimiter(
  FIVE_MINUTES,
  10,
  "Terlalu banyak permintaan. Silakan coba lagi dalam 5 menit."
);

/**
 * Refresh Token Limiter: 10 permintaan / 5 menit
 */
export const refreshLimiter = createLimiter(
  FIVE_MINUTES,
  10,
  "Terlalu banyak permintaan refresh token. Silakan tunggu beberapa saat."
);

/**
 * Global API Limiter: 100 permintaan / 5 menit
 */
export const globalLimiter = createLimiter(
  FIVE_MINUTES,
  100,
  "Batas akses permintaan API terlampaui. Silakan coba lagi nanti."
);
