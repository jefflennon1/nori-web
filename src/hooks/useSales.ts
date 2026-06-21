import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesSalesApi, ordersApi, paymentsApi, productsSalesApi } from '@/api/salesApi';
import type { OrderRequestDTO } from '@/types';

export function useSalesProducts(page = 0) {
  return useQuery({
    queryKey: ['sales', 'products', page],
    queryFn: () => productsSalesApi.list(page),
  });
}

export function useSalesCategories() {
  return useQuery({
    queryKey: ['sales', 'categories'],
    queryFn: categoriesSalesApi.list,
  });
}

export function useCreateSalesCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesSalesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales', 'categories'] }),
  });
}

export function useCreateSalesProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsSalesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales', 'products'] }),
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['sales', 'orders', 'mine'],
    queryFn: ordersApi.myOrders,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['sales', 'orders', id],
    queryFn: () => ordersApi.get(id as string),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrderRequestDTO) => ordersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales', 'orders'] }),
  });
}

export function useGeneratePix() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.generatePix(orderId),
  });
}
