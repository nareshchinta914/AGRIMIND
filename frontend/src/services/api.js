import axios from 'axios';

// Use /api directly with Vite proxy or fall back to direct backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('agrimind_access_token') ||
      localStorage.getItem('agrimind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!navigator.onLine) {
      return Promise.reject({
        isOffline: true,
        message: 'You are currently offline. Please check your internet connection.',
      });
    }

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('agrimind_access_token');
        localStorage.removeItem('agrimind_token');
        localStorage.removeItem('agrimind_user');
      }

      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Server encountered an error',
        data: error.response.data,
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        isNetworkError: true,
        message: 'Unable to connect to the agricultural server. Using local offline cache.',
      });
    }

    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
    });
  }
);

export default api;
