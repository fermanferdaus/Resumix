import { Router } from "express";
import authRoutes from "./authRoutes.js";
import prisma from "../config/prisma.js";

const router = Router();

// Health Check
router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      success: true,
      message: "Resumix Server & PostgreSQL are healthy",
      data: {
        database: { connected: true },
      },
      errors: null,
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      data: { database: { connected: false } },
      errors: [error.message],
    });
  }
});

// Module Routes
router.use("/auth", authRoutes);

export default router;
