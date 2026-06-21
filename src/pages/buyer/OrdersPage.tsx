import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { useMyOrders } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusTone: Record<OrderStatus, 'warning' | 'success' | 'danger'> = {
  PENDING_PAYMENT: 'warning',
  PAYMENT_CONFIRMED: 'success',
  CANCELLED: 'danger',
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pagamento pendente',
  PAYMENT_CONFIRMED: 'Pagamento confirmado',
  CANCELLED: 'Cancelado',
};

export default function OrdersPage() {
  const { data, isLoading } = useMyOrders();
  const navigate = useNavigate();

  if (isLoading) return <FullPageSpinner />;

  if (!data || data.length === 0) {
    return <EmptyState icon={Receipt} title="Você ainda não tem pedidos" />;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Meus pedidos</h1>
      </header>

      <div className="space-y-3">
        {data.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => navigate(`/buyer/orders/${order.id}`)}
          >
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-text-dim">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>
                <Badge tone={statusTone[order.status]}>{statusLabel[order.status]}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
