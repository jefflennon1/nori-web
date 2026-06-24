import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  Tags,
  Boxes,
  Warehouse,
  ArrowLeftRight,
  MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
}

export function useBuyerNav(): NavItem[] {
  const { t } = useLocale();
  return [
    { label: t.nav.catalog, to: '/buyer/catalog', icon: ShoppingBag },
    { label: t.nav.cart, to: '/buyer/cart', icon: ShoppingCart },
    { label: t.nav.myOrders, to: '/buyer/orders', icon: Receipt },
  ];
}

export function useSalesAdminNav(): NavItem[] {
  const { t } = useLocale();
  return [
    { label: t.nav.dashboard, to: '/sales-admin/dashboard', icon: LayoutDashboard },
    { label: t.nav.products, to: '/sales-admin/products', icon: Boxes },
    { label: t.nav.categories, to: '/sales-admin/categories', icon: Tags },
    { label: t.nav.orders, to: '/sales-admin/orders', icon: Receipt },
  ];
}

export function useStockNav(): NavItem[] {
  const { t } = useLocale();
  return [
    { label: t.nav.dashboard, to: '/stock/dashboard', icon: LayoutDashboard },
    { label: t.nav.products, to: '/stock/products', icon: Boxes },
    { label: t.nav.categories, to: '/stock/categories', icon: Tags },
    { label: t.nav.sectors, to: '/stock/sectors', icon: MapPin },
    { label: t.nav.movements, to: '/stock/movements', icon: ArrowLeftRight },
  ];
}

export const stockBranding = {
  name: 'Nori Stock',
  icon: Warehouse,
};
