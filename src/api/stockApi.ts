import { stockApi } from './stockClient';
import type { CategoryStockDTO, ProductStockDTO, SectorDTO, StockMovementDTO } from '@/types';
import { mockCategories, mockMovements, mockProducts, mockSectors } from './stockMockData';

/**
 * Vários endpoints de CRUD do nori-stock ainda estão sendo implementados no backend
 * (ver controller/ — hoje só existe AuthController). Para o front não ficar bloqueado,
 * cada função real tenta a chamada de verdade e, se ela falhar (404/501/erro de rede),
 * cai automaticamente para os dados mock. Assim que o endpoint existir de fato no
 * backend, o front passa a usar dados reais sem precisar de nenhuma mudança aqui.
 */
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
  list: () =>
    withFallback(
      () => stockApi.get<CategoryStockDTO[]>('/categories').then((r) => r.data),
      mockCategories
    ),
  create: (payload: { name: string; description?: string }) =>
    withFallback(
      () => stockApi.post<CategoryStockDTO>('/categories', payload).then((r) => r.data),
      { id: crypto.randomUUID(), active: true, ...payload }
    ),
};

export const sectorsApi = {
  list: () =>
    withFallback(() => stockApi.get<SectorDTO[]>('/sectors').then((r) => r.data), mockSectors),
  create: (payload: { name: string; description?: string; location?: string }) =>
    withFallback(
      () => stockApi.post<SectorDTO>('/sectors', payload).then((r) => r.data),
      { id: crypto.randomUUID(), active: true, ...payload }
    ),
};

export const productsStockApi = {
  list: () =>
    withFallback(
      () => stockApi.get<ProductStockDTO[]>('/products').then((r) => r.data),
      mockProducts
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
  list: () =>
    withFallback(
      () => stockApi.get<StockMovementDTO[]>('/stock-movements').then((r) => r.data),
      mockMovements
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
