import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesSalesApi, ordersApi, paymentsApi, productsSalesApi } from '@/api/salesApi';
import { toast } from '@/store/toastStore';
import { useLocale } from '@/i18n/LocaleContext';
import type { OrderRequestDTO } from '@/types';

export function useSalesProducts(page: number, size: number) {
  return useQuery({
    queryKey: ['sales', 'products', page, size],
    queryFn: () => productsSalesApi.list(page, size),
  });
}

export function useSalesCategories(page: number, size: number) {
  return useQuery({
    queryKey: ['sales', 'categories', page, size],
    queryFn: ()=> categoriesSalesApi.list(page, size),
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

export function useMyOrders(page = 0, size = 20) {
  return useQuery({
    queryKey: ['sales', 'orders', 'mine', page, size],
    queryFn: () => ordersApi.myOrders(page, size),
  });
}

export function useAllOrders(page = 0, size = 20) {
  return useQuery({
    queryKey: ['sales', 'orders', 'all', page, size],
    queryFn: () => ordersApi.allOrders(page, size),
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
