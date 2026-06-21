import { Boxes, Tags, Receipt, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { useSalesProducts, useSalesCategories } from '@/hooks/useSales';
import { useMyOrders } from '@/hooks/useSales';
import { formatCurrency } from '@/lib/utils';

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-text-dim">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function SalesDashboardPage() {
  const { data: productsPage } = useSalesProducts();
  const { data: categories } = useSalesCategories();
  const { data: orders } = useMyOrders();

  const revenue =
    orders?.filter((o) => o.status === 'PAYMENT_CONFIRMED').reduce((s, o) => s + o.totalPrice, 0) ?? 0;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard — Vendas</h1>
        <p className="text-text-dim text-sm mt-1">Visão geral da loja</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Boxes} label="Produtos" value={productsPage?.totalElements ?? 0} />
        <StatCard icon={Tags} label="Categorias" value={categories?.length ?? 0} />
        <StatCard icon={Receipt} label="Pedidos" value={orders?.length ?? 0} />
        <StatCard icon={TrendingUp} label="Receita confirmada" value={formatCurrency(revenue)} />
      </div>
    </div>
  );
}
