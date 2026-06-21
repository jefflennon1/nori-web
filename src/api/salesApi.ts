import { salesApi } from './salesClient';
import type {
  CategorySalesDTO,
  OrderRequestDTO,
  OrderResponseDTO,
  PaymentResponseDTO,
  ProductSalesDTO,
} from '@/types';

export const salesAuthApi = {
  login: (username: string, password: string) =>
    salesApi.post<{ token: string }>('/auth/login', { username, password }).then((r) => r.data),
  register: (payload: { name: string; username: string; email: string; password: string }) =>
    salesApi.post('/auth/register', payload).then((r) => r.data),
};

export const categoriesSalesApi = {
  list: () => salesApi.get<CategorySalesDTO[]>('/categories').then((r) => r.data),
  create: (payload: { name: string; description?: string }) =>
    salesApi.post<CategorySalesDTO>('/categories', payload).then((r) => r.data),
  update: (id: string, payload: { name: string; description?: string }) =>
    salesApi.put<CategorySalesDTO>(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id: string) => salesApi.delete(`/categories/${id}`).then((r) => r.data),
};

export const productsSalesApi = {
  list: (page = 0, size = 20) =>
    salesApi
      .get<{ content: ProductSalesDTO[]; totalPages: number; totalElements: number }>(
        '/products',
        { params: { page, size } }
      )
      .then((r) => r.data),
  get: (id: string) => salesApi.get<ProductSalesDTO>(`/products/${id}`).then((r) => r.data),
  create: (payload: {
    name: string;
    categoryId: string;
    description?: string;
    price: number;
    availableQuantity: number;
  }) => salesApi.post<ProductSalesDTO>('/products', payload).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    salesApi.put<ProductSalesDTO>(`/products/${id}`, payload).then((r) => r.data),
  remove: (id: string) => salesApi.delete(`/products/${id}`).then((r) => r.data),
};

export const ordersApi = {
  myOrders: () => salesApi.get<OrderResponseDTO[]>('/orders').then((r) => r.data),
  create: (payload: OrderRequestDTO) =>
    salesApi.post<OrderResponseDTO>('/orders', payload).then((r) => r.data),
  get: (id: string) => salesApi.get<OrderResponseDTO>(`/orders/${id}`).then((r) => r.data),
};

export const paymentsApi = {
  generatePix: (orderId: string) =>
    salesApi.post<PaymentResponseDTO>(`/payments/${orderId}/pix`).then((r) => r.data),
  getByOrder: (orderId: string) =>
    salesApi.get<PaymentResponseDTO>(`/payments/order/${orderId}`).then((r) => r.data),
};
