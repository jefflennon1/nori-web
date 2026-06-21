import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { buyerNav, salesAdminNav, stockNav } from '@/components/layout/navConfig';

import LoginPage from '@/pages/auth/LoginPage';

import CatalogPage from '@/pages/buyer/CatalogPage';
import CartPage from '@/pages/buyer/CartPage';
import OrdersPage from '@/pages/buyer/OrdersPage';
import OrderDetailPage from '@/pages/buyer/OrderDetailPage';

import SalesDashboardPage from '@/pages/sales/SalesDashboardPage';
import SalesProductsPage from '@/pages/sales/SalesProductsPage';
import SalesCategoriesPage from '@/pages/sales/SalesCategoriesPage';
import SalesOrdersPage from '@/pages/sales/SalesOrdersPage';

import StockDashboardPage from '@/pages/stock/StockDashboardPage';
import StockProductsPage from '@/pages/stock/StockProductsPage';
import StockCategoriesPage from '@/pages/stock/StockCategoriesPage';
import SectorsPage from '@/pages/stock/SectorsPage';
import MovementsPage from '@/pages/stock/MovementsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Buyer workspace (nori-sales, role BUYER) */}
      <Route element={<ProtectedRoute workspace="sales" allowedRoles={['BUYER']} />}>
        <Route element={<AppShell navItems={buyerNav} workspaceLabel="Loja" accentLabel="Comprador" />}>
          <Route path="/buyer/catalog" element={<CatalogPage />} />
          <Route path="/buyer/cart" element={<CartPage />} />
          <Route path="/buyer/orders" element={<OrdersPage />} />
          <Route path="/buyer/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Route>

      {/* Sales admin workspace (nori-sales, role ADMIN) */}
      <Route element={<ProtectedRoute workspace="sales" allowedRoles={['ADMIN']} />}>
        <Route element={<AppShell navItems={salesAdminNav} workspaceLabel="Vendas — Admin" accentLabel="Administrador" />}>
          <Route path="/sales-admin/dashboard" element={<SalesDashboardPage />} />
          <Route path="/sales-admin/products" element={<SalesProductsPage />} />
          <Route path="/sales-admin/categories" element={<SalesCategoriesPage />} />
          <Route path="/sales-admin/orders" element={<SalesOrdersPage />} />
        </Route>
      </Route>

      {/* Stock workspace (nori-stock, role OPERATOR/ADMIN) */}
      <Route element={<ProtectedRoute workspace="stock" allowedRoles={['OPERATOR', 'ADMIN']} />}>
        <Route element={<AppShell navItems={stockNav} workspaceLabel="Estoque" accentLabel="Operador" />}>
          <Route path="/stock/dashboard" element={<StockDashboardPage />} />
          <Route path="/stock/products" element={<StockProductsPage />} />
          <Route path="/stock/categories" element={<StockCategoriesPage />} />
          <Route path="/stock/sectors" element={<SectorsPage />} />
          <Route path="/stock/movements" element={<MovementsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
