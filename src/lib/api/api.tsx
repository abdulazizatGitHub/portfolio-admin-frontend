import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { loadingEmitter } from './loadingEmitter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const BACKEND_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Uploaded assets (images, CVs, icons) are served statically from the
 * backend's origin (e.g. `/uploads/...`), not under `/api/v1`. Backend
 * responses return these as relative paths — resolve them to a full URL
 * for use in <img>/<a> tags.
 */
export const toAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Inverse of toAssetUrl — strips the backend origin back off before
 * persisting a path, so re-saving an already-resolved URL doesn't bake the
 * dev origin into storage. Leaves third-party absolute URLs untouched.
 */
export const toRelativeAssetPath = (url?: string | null): string | null => {
  if (!url) return null;
  return url.startsWith(BACKEND_ORIGIN) ? url.slice(BACKEND_ORIGIN.length) : url;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to start loading
api.interceptors.request.use((config) => {
  // Only track non-auth check/refresh requests if desired,
  // but here we track all for consistency as requested
  loadingEmitter.startRequest();
  return config;
});

// Response interceptor to handle token refresh and end loading
api.interceptors.response.use(
  (response) => {
    loadingEmitter.endRequest();
    return response;
  },
  async (error: AxiosError) => {
    loadingEmitter.endRequest();
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and not already retrying, and not an auth-related request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint - HttpOnly refresh cookie is sent automatically
        await api.post('/auth/refresh');

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login if not already there
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Methods
export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export default api;
