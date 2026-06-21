import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { AuthUser, Role } from '@/types';

interface RawClaims {
  sub: string;
  role?: Role;
  iss?: string;
  exp: number;
}

function decode(token: string, service: 'sales' | 'stock'): AuthUser | null {
  try {
    const claims = jwtDecode<RawClaims>(token);
    return {
      username: claims.sub,
      sub: claims.sub,
      role: claims.role ?? (service === 'sales' ? 'BUYER' : 'OPERATOR'),
      exp: claims.exp,
      service,
    };
  } catch {
    return null;
  }
}

interface AuthState {
  salesToken: string | null;
  stockToken: string | null;
  salesUser: AuthUser | null;
  stockUser: AuthUser | null;
  activeWorkspace: 'sales' | 'stock' | null;

  loginSales: (token: string) => void;
  loginStock: (token: string) => void;
  logoutSales: () => void;
  logoutStock: () => void;
  logoutAll: () => void;
  setActiveWorkspace: (ws: 'sales' | 'stock') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      salesToken: null,
      stockToken: null,
      salesUser: null,
      stockUser: null,
      activeWorkspace: null,

      loginSales: (token) =>
        set({ salesToken: token, salesUser: decode(token, 'sales'), activeWorkspace: 'sales' }),
      loginStock: (token) =>
        set({ stockToken: token, stockUser: decode(token, 'stock'), activeWorkspace: 'stock' }),
      logoutSales: () => set({ salesToken: null, salesUser: null }),
      logoutStock: () => set({ stockToken: null, stockUser: null }),
      logoutAll: () =>
        set({
          salesToken: null,
          stockToken: null,
          salesUser: null,
          stockUser: null,
          activeWorkspace: null,
        }),
      setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),
    }),
    { name: 'nori-auth' }
  )
);

export function currentUser() {
  const state = useAuthStore.getState();
  if (state.activeWorkspace === 'sales') return state.salesUser;
  if (state.activeWorkspace === 'stock') return state.stockUser;
  return null;
}
