import { Boxes, MapPin, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useStockProducts, useSectors, useMovements } from '@/hooks/useStock';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useLocale } from '@/i18n/LocaleContext';

function StatCard({ icon: Icon, label, value }: { icon: typeof Boxes; label: string; value: string | number }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-2/10 text-accent-2">
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

export default function StockDashboardPage() {
  const { data: productsData, isLoading: loadingProducts } = useStockProducts(0, 100);
  const { data: sectorsData } = useSectors(0, 1);
  const { data: movementsData } = useMovements(0, 1);
  const { t } = useLocale();

  if (loadingProducts) return <FullPageSpinner />;

  const products = productsData?.content ?? [];
  const lowStock = products.filter((p) => p.quantity <= p.minQuantity);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t.stock.dashboard.title}</h1>
        <p className="text-text-dim text-sm mt-1">{t.stock.dashboard.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Boxes} label={t.stock.dashboard.statProducts} value={productsData?.totalElements ?? 0} />
        <StatCard icon={MapPin} label={t.stock.dashboard.statSectors} value={sectorsData?.totalElements ?? 0} />
        <StatCard icon={ArrowLeftRight} label={t.stock.dashboard.statMovements}  value={movementsData?.totalElements ?? 0} />
        <StatCard icon={AlertTriangle} label={t.stock.dashboard.statLowStock} value={lowStock.length} />
      </div>

      {lowStock.length > 0 && (
        <Card>
          <CardHeader>
            <span className="font-medium flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              {t.stock.dashboard.lowStockTitle}
            </span>
          </CardHeader>
          <CardBody className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <Badge tone="warning">
                 {t.stock.dashboard.minLabel(p.quantity, p.minQuantity)}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
