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
  enableAuthMock: process.env.ENABLE_AUTH_MOCK === "true",

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET, // Sensitif: Tanpa fallback
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET, // Sensitif: Tanpa fallback
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "12h",
    refreshCookieMaxAge: 12 * 60 * 60 * 1000, // 12 jam (43,200,000 ms)
  },

  cors: {
    origin: (() => {
      const origins = [];
      if (process.env.CORS_ORIGIN) {
        origins.push(...process.env.CORS_ORIGIN.split(",").map((url) => url.trim()).filter(Boolean));
      }
      if (process.env.CLIENT_URL) {
        const clientUrl = process.env.CLIENT_URL.trim();
        if (clientUrl && !origins.includes(clientUrl)) origins.push(clientUrl);
      }
      if (origins.length === 0) {
        origins.push("http://localhost:5173", "http://127.0.0.1:5173");
      }
      return origins;
    })(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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
    fromAddress: process.env.MAIL_FROM_ADDRESS || process.env.SMTP_USER || "noreply@resumix.app",
    fromName: process.env.MAIL_FROM_NAME || "Resumix No-Reply",
    replyTo: process.env.MAIL_REPLY_TO || "noreply@resumix.os-tech.online",
    logoUrl: process.env.MAIL_LOGO_URL || `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/logo.png`,
  },
};
