import { Boxes, Tags, Receipt, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { useSalesProducts, useSalesCategories } from '@/hooks/useSales';
import { useMyOrders } from '@/hooks/useSales';
import { formatCurrency } from '@/lib/utils';
import { useLocale } from '@/i18n/LocaleContext';

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
  const { t } = useLocale();

  const revenue =
    orders?.content.filter((o) => o.status === 'PAYMENT_CONFIRMED').reduce((s, o) => s + o.totalPrice, 0) ?? 0;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t.salesAdmin.dashboard.title}</h1>
        <p className="text-text-dim text-sm mt-1">{t.salesAdmin.dashboard.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Boxes} label={t.salesAdmin.dashboard.statProducts}  value={productsPage?.totalElements ?? 0} />
        <StatCard icon={Tags} label={t.salesAdmin.dashboard.statCategories} value={categories?.length ?? 0} />
        <StatCard icon={Receipt} label={t.salesAdmin.dashboard.statOrders}  value={orders?.content.length ?? 0} />
        <StatCard icon={TrendingUp} label={t.salesAdmin.dashboard.statRevenue} value={formatCurrency(revenue)} />
      </div>
    </div>
  );
}
