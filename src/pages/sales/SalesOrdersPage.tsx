import { Receipt } from 'lucide-react';
import { useMyOrders } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { useLocale } from '@/i18n/LocaleContext';

const statusTone: Record<OrderStatus, 'warning' | 'success' | 'danger'> = {
  PENDING_PAYMENT: 'warning',
  PAYMENT_CONFIRMED: 'success',
  CANCELLED: 'danger',
};

export default function SalesOrdersPage() {
  const { data, isLoading } = useMyOrders();
  const { t } = useLocale();

  if (isLoading) return <FullPageSpinner />;

  if (!data?.content || data.content.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={t.salesAdmin.orders.empty}
      />
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t.salesAdmin.orders.title}</h1>
      </header>
      <div className="space-y-3">
        {data.content.map((order) => (
          <Card key={order.id}>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="font-medium">#{order.id.slice(0, 8)} — {order.user?.username}</p>
                <p className="text-sm text-text-dim">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
