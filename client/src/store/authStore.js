import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("resumix_access_token") || null,
  isAuthenticated: !!localStorage.getItem("resumix_access_token"),
  isLoading: false,
  tempEmail: localStorage.getItem("resumix_temp_email") || "",

  setAuth: (user, accessToken) => {
    if (accessToken) {
      localStorage.setItem("resumix_access_token", accessToken);
    }
    set({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
    });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem("resumix_access_token", accessToken);
    set({ accessToken, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  setTempEmail: (email) => {
    localStorage.setItem("resumix_temp_email", email);
    set({ tempEmail: email });
  },

  clearTempEmail: () => {
    localStorage.removeItem("resumix_temp_email");
    set({ tempEmail: "" });
  },

  logout: () => {
    localStorage.removeItem("resumix_access_token");
    localStorage.removeItem("resumix_temp_email");
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      tempEmail: "",
    });
  },
}));
