import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package2, Store, Warehouse, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { salesAuthApi } from '@/api/salesApi';
import { stockAuthApi } from '@/api/stockApi';

type Workspace = 'sales' | 'stock';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginSales = useAuthStore((s) => s.loginSales);
  const loginStock = useAuthStore((s) => s.loginStock);

  const [workspace, setWorkspace] = useState<Workspace>('sales');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (workspace === 'sales') {
        const { token } = await salesAuthApi.login(username, password);
        loginSales(token);
        const role = useAuthStore.getState().salesUser?.role;
        navigate(role === 'ADMIN' ? '/sales-admin/dashboard' : '/buyer/catalog');
      } else {
        const { token } = await stockAuthApi.login(username, password);
        loginStock(token);
        navigate('/stock/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Package2 className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold">Nori Portfolio</h1>
            <p className="text-sm text-text-dim">Plataforma de vendas e estoque</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-1.5">
          <button
            type="button"
            onClick={() => setWorkspace('sales')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer',
              workspace === 'sales' ? 'bg-accent/15 text-accent' : 'text-text-dim hover:text-text'
            )}
          >
            <Store className="h-4 w-4" />
            Vendas / Loja
          </button>
          <button
            type="button"
            onClick={() => setWorkspace('stock')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer',
              workspace === 'stock' ? 'bg-accent/15 text-accent' : 'text-text-dim hover:text-text'
            )}
          >
            <Warehouse className="h-4 w-4" />
            Estoque
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={workspace === 'sales' ? 'ex: maria_buyer' : 'ex: operator_demo'}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Entrar
          </Button>

          <p className="text-center text-xs text-text-dim">
            {workspace === 'sales'
              ? 'Compradores e administradores da loja entram por aqui.'
              : 'Operadores e administradores do estoque entram por aqui.'}
          </p>
        </form>
      </div>
    </div>
  );
}
