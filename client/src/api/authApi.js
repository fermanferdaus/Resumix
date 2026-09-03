import apiClient from "./axios.js";

export const authApi = {
  // Check Email Availability
  checkEmail: async (email) => {
    const res = await apiClient.post("/auth/check-email", { email });
    return res.data;
  },

  // Send OTP
  sendOtp: async (email) => {
    const res = await apiClient.post("/auth/send-otp", { email });
    return res.data;
  },

  // Verify OTP
  verifyOtp: async (email, code) => {
    const res = await apiClient.post("/auth/verify-otp", { email, code });
    return res.data;
  },

  // Complete Registration
  register: async (payload) => {
    const res = await apiClient.post("/auth/register", payload);
    return res.data;
  },

  // Password Login
  login: async (payload) => {
    const res = await apiClient.post("/auth/login", payload);
    return res.data;
  },

  // Google OAuth Login
  googleAuth: async (idToken) => {
    const res = await apiClient.post("/auth/google", { idToken });
    return res.data;
  },

  // Forgot Password (Request Reset Link)
  forgotPassword: async (email) => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  },

  // Reset Password (Submit New Password)
  resetPassword: async (payload) => {
    const res = await apiClient.post("/auth/reset-password", payload);
    return res.data;
  },

  // Logout
  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },

  // Get Current User Profile
  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
};
