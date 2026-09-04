import dotenv from "dotenv";
dotenv.config();

/**
 * App Configuration Abstraction
 * Aturan: Semua environment variables harus diakses melalui config ini.
 */
export const appConfig = {
  port:
    parseInt(process.env.PORT, 10) ||
    parseInt(process.env.SERVER_PORT, 10) ||
    3000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: (process.env.NODE_ENV || "development") === "production",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET, // Sensitif: Tanpa fallback
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET, // Sensitif: Tanpa fallback
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "12h",
    refreshCookieMaxAge: 12 * 60 * 60 * 1000, // 12 jam (43,200,000 ms)
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim())
      : ["http://localhost:5173"],
    credentials: true,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Sensitif: Tanpa fallback
  },

  otp: {
    expiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES, 10) || 5,
  },

  mail: {
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT, 10) || 2525,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER, // Sensitif: Tanpa fallback
    pass: process.env.SMTP_PASS, // Sensitif: Tanpa fallback
    fromAddress: process.env.MAIL_FROM_ADDRESS || "noreply@resumix.app",
    fromName: process.env.MAIL_FROM_NAME || "Resumix ATS CV Builder",
  },
};
