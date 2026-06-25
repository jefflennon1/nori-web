import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesSalesApi, ordersApi, paymentsApi, productsSalesApi } from '@/api/salesApi';
import { toast } from '@/store/toastStore';
import { useLocale } from '@/i18n/LocaleContext';
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
  const { t } = useLocale();
  return useMutation({
    mutationFn: categoriesSalesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales', 'categories'] }); toast.success(t.toast.categoryCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useCreateSalesProduct() {
  const qc = useQueryClient();
  const { t } = useLocale();
  return useMutation({
    mutationFn: productsSalesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales', 'products'] }); toast.success(t.toast.productCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['sales', 'orders', 'mine'],
    queryFn: ordersApi.myOrders,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['sales', 'orders', 'mine'],
    queryFn: ordersApi.allOrders,
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
  const { t } = useLocale();
  return useMutation({
    mutationFn: (payload: OrderRequestDTO) => ordersApi.create(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales', 'orders'] }); toast.success(t.toast.orderCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useGeneratePix() {
  const { t } = useLocale();
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.generatePix(orderId),
    onSuccess: () => toast.success(t.toast.pixGenerated),
    onError: () => toast.error(t.toast.genericError),
  });
}
