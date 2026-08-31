import { errorResponse } from "../utils/response.js";
import { appConfig } from "../config/app.js";

/**
 * 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Resource rute '${req.originalUrl}' tidak ditemukan`, null, 404);
};

/**
 * Global Exception & Error Handler
 */
export const errorHandler = (err, req, res, _next) => {
  console.error("Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan internal pada server";
  const errors = appConfig.nodeEnv === "development" ? err.stack : null;

  return errorResponse(res, message, errors, statusCode);
};
