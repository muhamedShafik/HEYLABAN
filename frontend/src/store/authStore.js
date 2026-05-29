// src/store/authStore.js
import { create } from "zustand";
import api from "../services/api";
import { useSessionStore } from "./sessionStore";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    const { accessToken, user } = response.data.data;

    window.accessToken = accessToken;

    set({
      user,
      isAuthenticated: true,
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
    });
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
}));