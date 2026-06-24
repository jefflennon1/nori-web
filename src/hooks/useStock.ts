import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  categoriesStockApi,
  movementsApi,
  productsStockApi,
  sectorsApi,
} from '@/api/stockApi';
import { toast } from '@/store/toastStore';
import { useLocale } from '@/i18n/LocaleContext';

export function useStockProducts() {
  return useQuery({ queryKey: ['stock', 'products'], queryFn: productsStockApi.list });
}

export function useStockCategories() {
  return useQuery({ queryKey: ['stock', 'categories'], queryFn: categoriesStockApi.list });
}

export function useSectors() {
  return useQuery({ queryKey: ['stock', 'sectors'], queryFn: sectorsApi.list });
}

export function useMovements() {
  return useQuery({ queryKey: ['stock', 'movements'], queryFn: movementsApi.list });
}

export function useCreateStockCategory() {
  const qc = useQueryClient();
  const { t } = useLocale();
  return useMutation({
    mutationFn: categoriesStockApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock', 'categories'] }); toast.success(t.toast.categoryCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useCreateSector() {
  const qc = useQueryClient();
  const { t } = useLocale();
  return useMutation({
    mutationFn: sectorsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock', 'sectors'] }); toast.success(t.toast.sectorCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useCreateStockProduct() {
  const qc = useQueryClient();
  const { t } = useLocale();
  return useMutation({
    mutationFn: productsStockApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock', 'products'] }); toast.success(t.toast.productCreated); },
    onError: () => toast.error(t.toast.genericError),
  });
}

export function useCreateMovement() {
  const qc = useQueryClient();
  const { t } = useLocale();
  return useMutation({
    mutationFn: movementsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock', 'movements'] });
      qc.invalidateQueries({ queryKey: ['stock', 'products'] });
      toast.success(t.toast.movementCreated);
    },
    onError: () => toast.error(t.toast.genericError),
  });
}
