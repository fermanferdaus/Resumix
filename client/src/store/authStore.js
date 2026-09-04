import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  tempEmail: localStorage.getItem("resumix_temp_email") || "",

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken, isAuthenticated: true, isLoading: false });
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

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  logout: () => {
    localStorage.removeItem("resumix_temp_email");
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      tempEmail: "",
    });
  },
}));
