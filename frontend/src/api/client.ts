import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Required for Sanctum
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// CSRF Handling for Laravel Sanctum
export const getCsrfCookie = () => {
  const baseURL = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) || '/' : '/';
  return api.get('/sanctum/csrf-cookie', { baseURL });
};

// Add a request interceptor to attach the token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle session expiration and data unwrapping
api.interceptors.response.use(
  (response) => {
    // If the response follows our standardized { status, data, message } format, unwrap it
    if (response.data && typeof response.data === 'object' && 'status' in response.data && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:expired'));
        if (window.location.hash !== '#/login') {
          window.location.href = '#/login';
        }
      } else if (error.response?.status === 403) {
        window.dispatchEvent(new CustomEvent('api:forbidden', {
          detail: error.response?.data?.message || 'You are not allowed to perform this action.'
        }));
      }
    return Promise.reject(error);
  }
);

export const unwrapPaginatedData = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

export default api;
