import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { adminLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

// Seluruh rute admin dilindungi oleh:
// 1. adminLimiter (Rate limiting khusus rute admin)
// 2. requireAuth (Wajib membawa valid Bearer JWT)
// 3. isAdmin (Wajib memiliki peran ADMIN)
router.use(requireAuth);
router.use(isAdmin);
router.use(adminLimiter);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/anomalies", adminController.getAnomalies);
router.get("/logs", adminController.getLogs);
router.post("/users/:userId/revoke-sessions", adminController.revokeUserSessions);

export default router;
