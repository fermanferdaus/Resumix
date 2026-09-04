import * as adminService from "../services/adminService.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Controller: Admin Dashboard & Monitoring
 */

/**
 * GET /api/v1/admin/stats
 * Mengambil ringkasan metrik statistik akun, CV, dan anomali
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, "Statistik dashboard berhasil diambil", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/users
 * Mengambil daftar pengguna beserta jumlah CV yang dibuat
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = req.query.search || "";
    const role = req.query.role || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    const result = await adminService.getUsersWithCvStats({
      page,
      limit,
      search,
      role,
      startDate,
      endDate,
    });
    return successResponse(res, "Daftar pengguna berhasil diambil", result.items, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/anomalies
 * Mengambil deteksi anomali keamanan real-time
 */
export const getAnomalies = async (req, res, next) => {
  try {
    const anomalies = await adminService.getSecurityAnomalies();
    return successResponse(res, "Daftar anomali keamanan berhasil diambil", anomalies);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/logs
 * Mengambil log aktivitas login dan geolokasi IP
 */
export const getLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const status = req.query.status || "";
    const search = req.query.search || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    const result = await adminService.getLoginLogs({
      page,
      limit,
      status,
      search,
      startDate,
      endDate,
    });
    return successResponse(res, "Log aktivitas login berhasil diambil", result.items, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/users/:userId/revoke-sessions
 * Memutus seluruh sesi aktif milik pengguna tertentu (Force Logout)
 */
export const revokeUserSessions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return errorResponse(res, "User ID wajib disediakan", null, 400);
    }

    const result = await adminService.revokeUserSessions(userId);
    return successResponse(
      res,
      `Berhasil memutuskan ${result.revokedCount} sesi aktif milik ${result.email}`,
      result
    );
  } catch (error) {
    next(error);
  }
};
