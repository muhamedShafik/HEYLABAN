// import axios from "axios";
// import { useAuthStore } from "../store/authStore";

// const API_BASE_URL =
//   "http://localhost:8000";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//   },
// });

// const refreshClient = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//   },
// });

// api.interceptors.request.use((config) => {
//   if (window.accessToken) {
//     config.headers.Authorization = `Bearer ${window.accessToken}`;
//   }
//   return config;
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error?.response?.status !== 401 || originalRequest?._retry) {
//       return Promise.reject(error);
//     }

//     if (originalRequest?.url?.includes("/api/auth/refresh")) {
//       window.accessToken = null;
//       return Promise.reject(error);
//     }

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then((token) => {
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return api(originalRequest);
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       const refreshResponse = await refreshClient.post("/api/auth/refresh", {});

//       const newAccessToken = refreshResponse.data.data.accessToken;
//       window.accessToken = newAccessToken;

//       processQueue(null, newAccessToken);

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       return api(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError, null);
//       window.accessToken = null;
//       useAuthStore.getState().clearAuth();

//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }

//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   },
// );

// export default api;

import axios from "axios";
import { useAuthStore } from "../store/authStore";


const API_BASE_URL =
   "http://localhost:8000";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});


const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});


api.interceptors.request.use((config) => {
  if (window.accessToken) {
    config.headers.Authorization = `Bearer ${window.accessToken}`;
  }
  return config;
});


let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });


  failedQueue = [];
};


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error?.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }


    if (originalRequest?.url?.includes("/api/auth/refresh")) {
      window.accessToken = null;
      return Promise.reject(error);
    }


    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token};`
        return api(originalRequest);
      });
    }


    originalRequest._retry = true;
    isRefreshing = true;


    try {
      const refreshResponse = await refreshClient.post("/api/auth/refresh");


      const newAccessToken = refreshResponse.data.data.accessToken;
      window.accessToken = newAccessToken;


      processQueue(null, newAccessToken);


      originalRequest.headers.Authorization = `Bearer ${newAccessToken};`
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      window.accessToken = null;
      useAuthStore.getState().clearAuth();


      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }


      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);


export default api;