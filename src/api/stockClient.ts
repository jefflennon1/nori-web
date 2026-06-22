import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const STOCK_BASE_URL =
  import.meta.env.VITE_STOCK_API_URL ?? 'http://localhost:8082/nori-stock/v1';

export const stockApi = axios.create({
  baseURL: STOCK_BASE_URL,
});

stockApi.interceptors.request.use((config) => {
   if (config.url?.startsWith('/auth')) return config;
  const token = useAuthStore.getState().stockToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

stockApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logoutStock();
    }
    return Promise.reject(error);
  }
);
