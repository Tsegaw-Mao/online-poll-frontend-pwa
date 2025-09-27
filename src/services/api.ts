import axios, { type AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  detail?: string;
}

const api = axios.create({
  baseURL: "https://online-poll-backend-ehm8.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// Helper function to get tokens
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse> & { config?: CustomAxiosRequestConfig }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data?.detail?.includes("not valid for any token type") &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use axios directly for refresh to avoid interceptor loop
        const refreshResponse = await axios.post(
          "https://online-poll-backend-ehm8.onrender.com/api/auth/refresh/",
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { access } = refreshResponse.data;

        // Save new token
        localStorage.setItem('access_token', access);
        
        // Update the original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors (like missing credentials)
    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.detail || "Authentication required";
      if (errorMessage.includes("credentials were not provided")) {
        // Redirect to login if trying to access protected route without auth
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?message=' + encodeURIComponent('Please login to access this feature');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login/",
    LOGOUT: "/api/auth/logout/",
    REFRESH: "/api/auth/refresh/",
    REGISTER: "/api/auth/register/",
  },
  POLLS: {
    LIST: "/api/polls/",
    CREATE: "/api/polls/",
    DETAIL: (id: number) => `/api/polls/${id}/`,
    VOTE: "/api/vote/",
  },
};