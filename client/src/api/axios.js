import axios from 'axios';

const raw = (import.meta.env.VITE_API_URL || 'https://zoronal-assessment-xeoj.vercel.app').trim();
const normalized = raw.replace(/\/+$/, '');
const API_URL = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

if (API_URL.includes('/auth/') || API_URL.includes('/companies') || API_URL.includes('/reviews')) {
  // eslint-disable-next-line no-console
  console.warn(
    '[config] VITE_API_URL should be the API base (e.g. https://backend.vercel.app/api). Current:',
    API_URL
  );
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Cookie-based auth (JWT in httpOnly cookie). Authorization header fallback supported by backend.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
