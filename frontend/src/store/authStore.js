
import { create } from "zustand";
import api from "../services/api";
import { useSessionStore } from "./sessionStore";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,

  initializeAuth: async () => {
    try {
      const response = await api.post("/api/auth/refresh", {});
      const { accessToken, user } = response.data.data;

      window.accessToken = accessToken;

      set({
        user: user ?? null,
        isAuthenticated: true,
        isAuthLoading: false,
      });
    } catch {
      window.accessToken = null;

      set({
        user: null,
        isAuthenticated: false,
        isAuthLoading: false,
      });
    }
  },

  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    const { accessToken, user } = response.data.data;

    window.accessToken = accessToken;

    set({
      user,
      isAuthenticated: true,
      isAuthLoading: false,
    });

    return user;
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore logout API error
    }

    window.accessToken = null;
    useSessionStore.getState().clearTodaySession();

    set({
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () => {
    window.accessToken = null;
    useSessionStore.getState().clearTodaySession();

    set({
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  },
}));