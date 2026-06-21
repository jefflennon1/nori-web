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

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const buyerNav: NavItem[] = [
  { label: 'Catálogo', to: '/buyer/catalog', icon: ShoppingBag },
  { label: 'Carrinho', to: '/buyer/cart', icon: ShoppingCart },
  { label: 'Meus pedidos', to: '/buyer/orders', icon: Receipt },
];

export const salesAdminNav: NavItem[] = [
  { label: 'Dashboard', to: '/sales-admin/dashboard', icon: LayoutDashboard },
  { label: 'Produtos', to: '/sales-admin/products', icon: Boxes },
  { label: 'Categorias', to: '/sales-admin/categories', icon: Tags },
  { label: 'Pedidos', to: '/sales-admin/orders', icon: Receipt },
];

export const stockNav: NavItem[] = [
  { label: 'Dashboard', to: '/stock/dashboard', icon: LayoutDashboard },
  { label: 'Produtos', to: '/stock/products', icon: Boxes },
  { label: 'Categorias', to: '/stock/categories', icon: Tags },
  { label: 'Setores', to: '/stock/sectors', icon: MapPin },
  { label: 'Movimentações', to: '/stock/movements', icon: ArrowLeftRight },
];

export const stockBranding = {
  name: 'Nori Stock',
  icon: Warehouse,
};
