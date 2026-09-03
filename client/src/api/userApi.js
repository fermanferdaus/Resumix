import apiClient from "./axios.js";

/**
 * User Profile API Client
 */
export const userApi = {
  /**
   * Ambil data profil pengguna yang sedang login
   */
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  /**
   * Perbarui biodata profil pengguna (nama lengkap, no hp, tgl lahir, domisili)
   */
  updateProfile: async (data) => {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  },

  /**
   * Unggah dan perbarui foto profil (base64 terkompresi .webp)
   */
  uploadAvatar: async (imageDataUrl) => {
    const response = await apiClient.post("/users/avatar", { image: imageDataUrl });
    return response.data;
  },

  /**
   * Hapus foto profil pengguna
   */
  deleteAvatar: async () => {
    const response = await apiClient.delete("/users/avatar");
    return response.data;
  },
};
