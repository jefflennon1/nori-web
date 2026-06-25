import { stockApi } from './stockClient';
import type { CategoryStockDTO, ProductStockDTO, SectorDTO, StockMovementDTO, PageResponse } from '@/types';
import { mockCategories, mockMovements, mockProducts, mockSectors } from './stockMockData';

async function withFallback<T>(real: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await real();
  } catch (err) {
    console.warn('[nori-stock] endpoint indisponível, usando dados mock como fallback:', err);
    return fallback;
  }
}

export const stockAuthApi = {
  login: (username: string, password: string) =>
    stockApi.post<{ token: string }>('/auth/login', { username, password }).then((r) => r.data),
};

export const categoriesStockApi = {
  list: (page = 0, size = 20) =>
    withFallback(
      () => stockApi.get<PageResponse<CategoryStockDTO>>('/categories', { params: { page, size } }).then((r) => r.data),
      { content: mockCategories, totalElements: mockCategories.length, totalPages: 1, number: 0, size, empty: false, first: true, last: true, numberOfElements: mockCategories.length } as PageResponse<CategoryStockDTO>
    ),
  create: (payload: { name: string; description?: string }) =>
    withFallback(
      () => stockApi.post<CategoryStockDTO>('/categories', payload).then((r) => r.data),
      { id: crypto.randomUUID(), active: true, ...payload }
    ),
};

export const sectorsApi = {
  list: (page = 0, size = 20) =>
    withFallback(
      () => stockApi.get<PageResponse<SectorDTO>>('/sectors', { params: { page, size } }).then((r) => r.data),
      { content: mockSectors, totalElements: mockSectors.length, totalPages: 1, number: 0, size, empty: false, first: true, last: true, numberOfElements: mockSectors.length } as PageResponse<SectorDTO>
    ),
  create: (payload: { name: string; description?: string; location?: string }) =>
    withFallback(
      () => stockApi.post<SectorDTO>('/sectors', payload).then((r) => r.data),
      { id: crypto.randomUUID(), active: true, ...payload }
    ),
};

export const productsStockApi = {
  list: (page = 0, size = 20) =>
    withFallback(
      () => stockApi.get<PageResponse<ProductStockDTO>>('/products', { params: { page, size } }).then((r) => r.data),
      { content: mockProducts, totalElements: mockProducts.length, totalPages: 1, number: 0, size, empty: false, first: true, last: true, numberOfElements: mockProducts.length } as PageResponse<ProductStockDTO>
    ),
  create: (payload: {
    name: string;
    categoryId: string;
    sectorId: string;
    description?: string;
    sku?: string;
    quantity: number;
    minQuantity: number;
  }) =>
    withFallback(
      () => stockApi.post<ProductStockDTO>('/products', payload).then((r) => r.data),
      mockProducts[0]
    ),
  update: (id: string, payload: Record<string, unknown>) =>
    withFallback(
      () => stockApi.put<ProductStockDTO>(`/products/${id}`, payload).then((r) => r.data),
      { ...mockProducts.find((p) => p.id === id)!, ...payload }
    ),
};

export const movementsApi = {
  list: (page = 0, size = 20) =>
    withFallback(
      () => stockApi.get<PageResponse<StockMovementDTO>>('/stock-movements', { params: { page, size } }).then((r) => r.data),
      { content: mockMovements, totalElements: mockMovements.length, totalPages: 1, number: 0, size, empty: false, first: true, last: true, numberOfElements: mockMovements.length } as PageResponse<StockMovementDTO>
    ),
  create: (payload: {
    productId: string;
    sectorId: string;
    type: 'OUTBOUND' | 'INBOUND' | 'ADJUSTMENT';
    quantity: number;
    reason?: string;
  }) =>
    withFallback(
      () => stockApi.post<StockMovementDTO>('/stock-movements', payload).then((r) => r.data),
      mockMovements[0]
    ),
};
