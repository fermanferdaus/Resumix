import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appConfig } from "./config/app.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";

const app = express();

// Security & Parsing Middlewares
app.use(cors(appConfig.cors));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Interactive API Documentation
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api/v1/docs.json", (req, res) => res.json(swaggerDocument));

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
if (process.env.NODE_ENV !== "test") {
  app.listen(appConfig.port, () => {
    console.log(`🚀 Resumix Backend Server running on port ${appConfig.port} [${appConfig.nodeEnv}]`);
  });
}

export default app;
