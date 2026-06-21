import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  categoriesStockApi,
  movementsApi,
  productsStockApi,
  sectorsApi,
} from '@/api/stockApi';

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
  return useMutation({
    mutationFn: categoriesStockApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock', 'categories'] }),
  });
}

export function useCreateSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sectorsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock', 'sectors'] }),
  });
}

export function useCreateStockProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsStockApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock', 'products'] }),
  });
}

export function useCreateMovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: movementsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock', 'movements'] });
      qc.invalidateQueries({ queryKey: ['stock', 'products'] });
    },
  });
}
