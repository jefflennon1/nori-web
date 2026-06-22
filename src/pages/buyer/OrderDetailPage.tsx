import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { useOrder, useGeneratePix } from '@/hooks/useSales';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { useLocale } from '@/i18n/LocaleContext';

const statusTone: Record<OrderStatus, 'warning' | 'success' | 'danger'> = {
  PENDING_PAYMENT: 'warning',
  PAYMENT_CONFIRMED: 'success',
  CANCELLED: 'danger',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);
  const generatePix = useGeneratePix();
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();

  if (isLoading) return <FullPageSpinner />;
  if (!order) return null;

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pix = generatePix.data;

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold"> {t.buyer.orders.orderNumber(order.id.slice(0, 8))}</h1>
        <p className="text-text-dim text-sm mt-1">{formatDate(order.createdAt)}</p>
      </header>

      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <span className="font-medium">{t.buyer.orderDetail.items}</span>
          <Badge tone={statusTone[order.status]}>{t.buyer.orders.status[order.status]}</Badge>
        </CardHeader>
        <CardBody className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span className="text-text-dim">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex items-center justify-between font-semibold">
            <span>{t.buyer.orderDetail.total}</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </CardBody>
      </Card>

      {order.status === 'PENDING_PAYMENT' && (
        <Card>
          <CardHeader>
            <span className="font-medium">{t.buyer.orderDetail.pixTitle}</span>
          </CardHeader>
          <CardBody>
            {!pix ? (
              <Button
                loading={generatePix.isPending}
                onClick={() => generatePix.mutate(order.id)}
              >
                <QrCode className="h-4 w-4" />
               {t.buyer.orderDetail.generatePix}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={`data:image/png;base64,${pix.pixQrCodeB64}`}
                  alt={t.buyer.orderDetail.qrAlt}
                  className="h-48 w-48 rounded-lg border border-border bg-white p-2"
                />
                <Button variant="secondary" onClick={() => handleCopy(pix.pixQrCode)} className="w-full">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? t.buyer.orderDetail.copied : t.buyer.orderDetail.copyPix}
                </Button>
                <p className="text-xs text-text-dim text-center">
                 {t.buyer.orderDetail.pixHint}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
