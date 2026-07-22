import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://momentum-backend-api.onrender.com/api';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('momentum_token') || sessionStorage.getItem('momentum_token');
};

export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('momentum_refresh') || sessionStorage.getItem('momentum_refresh');
};

export const setStoredTokens = (access: string, refresh: string, rememberMe: boolean = true) => {
  if (rememberMe) {
    localStorage.setItem('momentum_token', access);
    localStorage.setItem('momentum_refresh', refresh);
    sessionStorage.removeItem('momentum_token');
    sessionStorage.removeItem('momentum_refresh');
  } else {
    sessionStorage.setItem('momentum_token', access);
    sessionStorage.setItem('momentum_refresh', refresh);
    localStorage.removeItem('momentum_token');
    localStorage.removeItem('momentum_refresh');
  }
};

export const clearStoredTokens = () => {
  localStorage.removeItem('momentum_token');
  localStorage.removeItem('momentum_refresh');
  sessionStorage.removeItem('momentum_token');
  sessionStorage.removeItem('momentum_refresh');
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/auth/token/') || originalRequest.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const refresh = getStoredRefreshToken();

      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
          if (res.data.access) {
            const rememberMe = !!localStorage.getItem('momentum_token');
            setStoredTokens(res.data.access, res.data.refresh || refresh, rememberMe);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return axiosClient(originalRequest);
          }
        } catch {
          clearStoredTokens();
          window.location.href = '/login';
        }
      } else {
        clearStoredTokens();
      }
    }
    return Promise.reject(error);
  }
);
