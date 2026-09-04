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

/**
 * GET /api/v1/admin/2fa/setup
 * Menghasilkan secret Base32 dan QR code data URL untuk discan di Google Authenticator
 */
export const get2FASetup = async (req, res, next) => {
  try {
    const setupData = await adminService.setup2FA(req.user.id);
    return successResponse(res, "Setup Google Authenticator berhasil diinisialisasi", setupData);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/2fa/enable
 * Memvalidasi kode 6-digit pertama dan mengaktifkan 2FA
 */
export const enable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, "Kode verifikasi 6 digit wajib diisi", null, 400);
    }

    const result = await adminService.enable2FA(req.user.id, token);
    return successResponse(res, result.message, { backupCodes: result.backupCodes });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/2fa/disable
 * Menonaktifkan 2FA dengan verifikasi sandi dan kode verifikasi
 */
export const disable2FA = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return errorResponse(res, "Kode verifikasi dan kata sandi wajib diisi", null, 400);
    }

    const result = await adminService.disable2FA(req.user.id, token, password);
    return successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/2fa/status
 * Memeriksa status 2FA pada akun admin yang sedang login
 */
export const get2FAStatus = async (req, res, next) => {
  try {
    const status = await adminService.get2FAStatus(req.user.id);
    return successResponse(res, "Status 2FA berhasil diambil", status);
  } catch (error) {
    next(error);
  }
};

