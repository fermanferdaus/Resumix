import apiClient from "./axios.js";

/**
 * Client API Service: Admin Dashboard & Security Monitoring
 */
export const adminApi = {
  /**
   * Mengambil statistik ringkasan dan tren 7 hari
   */
  getStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  /**
   * Mengambil daftar pengguna beserta jumlah CV terbuat
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  },

  /**
   * Mengambil daftar anomali keamanan real-time
   */
  getAnomalies: async () => {
    const response = await apiClient.get("/admin/anomalies");
    return response.data;
  },

  /**
   * Mengambil log aktivitas login & geolokasi
   */
  getLogs: async (params = {}) => {
    const response = await apiClient.get("/admin/logs", { params });
    return response.data;
  },

  /**
   * Memutuskan seluruh sesi aktif pengguna
   */
  revokeUserSessions: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/revoke-sessions`);
    return response.data;
  },

  /**
   * Ambil status 2FA Google Authenticator
   */
  get2FAStatus: async () => {
    const response = await apiClient.get("/admin/2fa/status");
    return response.data;
  },

  /**
   * Inisialisasi setup 2FA (dapatkan secret & QR Code)
   */
  get2FASetup: async () => {
    const response = await apiClient.get("/admin/2fa/setup");
    return response.data;
  },

  /**
   * Konfirmasi & aktifkan 2FA dengan token 6 digit
   */
  enable2FA: async (token) => {
    const response = await apiClient.post("/admin/2fa/enable", { token });
    return response.data;
  },

  /**
   * Nonaktifkan 2FA dengan password dan token/backup code
   */
  disable2FA: async ({ token, password }) => {
    const response = await apiClient.post("/admin/2fa/disable", { token, password });
    return response.data;
  },
};
