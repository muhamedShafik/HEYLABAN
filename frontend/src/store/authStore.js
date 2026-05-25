import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });

    
    const { accessToken, user } = response.data.data;

    
    window.__accessToken = accessToken;

    set({ user, isAuthenticated: true });
    return user;
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      
    }
    window.__accessToken = null;
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
}));