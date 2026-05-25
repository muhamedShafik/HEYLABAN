import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AppRouter from "./router/AppRouter.jsx";
import api from "./services/api.js";
import { useAuthStore } from "./store/authStore.js";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function initAuth() {
  try {
    // on every page load, try to get new access token using refresh cookie
    const response = await api.post("/api/auth/refresh");
    const { accessToken, user } = response.data.data;

    window.__accessToken = accessToken;        // restore access token to memory
    useAuthStore.getState().setUser(user);     // restore user to Zustand
  } catch {
    // no valid refresh cookie → stay on login, do nothing
  }
}
const queryClient = new QueryClient();

initAuth().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>   {/* ← must wrap here */}
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
});