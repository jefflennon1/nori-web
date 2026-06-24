import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Package2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { NavItem } from './navConfig';
import { useLocale } from '@/i18n/LocaleContext';
import { LocaleSwitch } from '@/components/ui/LocaleSwitch';

export function AppShell({
  navItems,
  workspaceLabel,
  accentLabel,
}: {
  navItems: NavItem[];
  workspaceLabel: string;
  accentLabel: string;
}) {
  const navigate = useNavigate();
  const activeWorkspace = useAuthStore((s) => s.activeWorkspace);
  const salesUser = useAuthStore((s) => s.salesUser);
  const stockUser = useAuthStore((s) => s.stockUser);
  const logoutAll = useAuthStore((s) => s.logoutAll);
  const { t } = useLocale();

  const user = activeWorkspace === 'sales' ? salesUser : stockUser;

  function handleLogout() {
    logoutAll();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-bg text-text">
      <aside className="flex w-64 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold leading-none">Nori</p>
            <p className="text-xs text-text-dim">{workspaceLabel}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-dim hover:bg-surface-2 hover:text-text'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-danger text-white text-xs font-bold px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
           <LocaleSwitch className="w-full justify-center" />
          <div className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-2/15 text-accent-2 text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-text-dim">{accentLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-dim hover:bg-surface-2 hover:text-danger transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
             {t.common.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
