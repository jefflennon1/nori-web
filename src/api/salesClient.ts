import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const SALES_BASE_URL =
  import.meta.env.VITE_SALES_API_URL ?? 'http://localhost:8081/nori-sales/v1';

export const salesApi = axios.create({
  baseURL: SALES_BASE_URL,
});

salesApi.interceptors.request.use((config) => {
   if (config.url?.startsWith('/auth')) return config;
  const token = useAuthStore.getState().salesToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

salesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logoutSales();
    }
    return Promise.reject(error);
  }
);
