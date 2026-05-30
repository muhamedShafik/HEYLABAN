import axios from "axios";

const api = axios.create({
  baseURL: "https://pedagogically-sensationless-lanell.ngrok-free.dev",
  withCredentials: true, 
   headers: {
    "ngrok-skip-browser-warning": "true",
  }
});

// attach access token to every request
api.interceptors.request.use((config) => {
  const token = window.__accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if any request gets 401 → try refresh → retry once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response, // success — pass through
  async (error) => {
    const originalRequest = error.config;

    // if 401 and not already retrying and not the refresh/login endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/refresh") &&
      !originalRequest.url.includes("/api/auth/login")
    ) {
      if (isRefreshing) {
        // queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh — refresh cookie is sent automatically by browser
        const response = await api.post("/api/auth/refresh");
        const newToken = response.data.data.accessToken;

        window.__accessToken = newToken;
        processQueue(null);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed → session expired → redirect to login
        processQueue(refreshError);
        window.__accessToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;