// Centralized API configuration supporting local development and cloud production deployment
const getApiBaseUrl = () => {
  // If explicitly configured in environment (e.g. VITE_API_URL=https://api.farmfriend.com)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }

  // If running in browser and not localhost, use relative path or same origin
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return window.location.origin;
  }

  // Default fallback for local dev
  return "http://localhost:5000";
};

export const API_ROOT = getApiBaseUrl();
export const API_BASE_URL = `${API_ROOT}/api`;

export default API_ROOT;
