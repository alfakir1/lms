import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true, // Required for Sanctum
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// CSRF Handling for Laravel Sanctum
export const getCsrfCookie = () => {
  return api.get('/sanctum/csrf-cookie', { baseURL: '/' });
};

// Add a request interceptor to attach the token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:expired'));
        if (window.location.hash !== '#/login') {
          window.location.href = '#/login';
        }
      }
    return Promise.reject(error);
  }
);

export default api;
