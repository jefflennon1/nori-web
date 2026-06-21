import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';

export function ProtectedRoute({
  workspace,
  allowedRoles,
}: {
  workspace: 'sales' | 'stock';
  allowedRoles?: Role[];
}) {
  const token = useAuthStore((s) => (workspace === 'sales' ? s.salesToken : s.stockToken));
  const user = useAuthStore((s) => (workspace === 'sales' ? s.salesUser : s.stockUser));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
