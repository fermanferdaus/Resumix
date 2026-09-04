import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { appConfig } from "./config/app.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";

import helmet from "helmet";
import { globalLimiter } from "./middlewares/rateLimitMiddleware.js";

const app = express();

// Disable X-Powered-By header
app.disable("x-powered-by");

// Helmet Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Trust reverse proxy in production (Nginx container / VPS)
if (appConfig.isProduction) {
  app.set("trust proxy", 1);
}

// Global Rate Limiter
app.use(globalLimiter);

// Security & Parsing Middlewares
app.use(cors(appConfig.cors));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Media Serving (/uploads) with nosniff header
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"), {
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// Swagger Interactive API Documentation (Hanya aktif di non-production)
if (!appConfig.isProduction) {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api/v1/docs.json", (req, res) => res.json(swaggerDocument));
}

// Root welcome endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Resumix ATS CV Builder API Server",
    data: {
      version: "v1",
      docs: "/api/v1/docs",
      health: "/api/v1/health",
    },
    errors: null,
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(appConfig.port, () => {
  console.log(`[SERVER RUNNING] Port ${appConfig.port} [${appConfig.nodeEnv}]`);
});

export default app;
