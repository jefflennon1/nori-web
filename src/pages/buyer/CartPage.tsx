import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { useLocale } from '@/i18n/LocaleContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { lines, remove, setQuantity, clear, total } = useCartStore();
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  async function handleCheckout() {
    setError(null);
    try {
      const order = await createOrder.mutateAsync({
        items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      });
      clear();
      navigate(`/buyer/orders/${order.id}`);
    } catch (err) {
      console.error(err);
      setError(t.buyer.cart.checkoutError);
    }
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title={t.buyer.cart.emptyTitle}
        description={t.buyer.cart.emptyDescription}
        action={
          <Button variant="secondary" onClick={() => navigate('/buyer/catalog')}>
           {t.buyer.cart.viewCatalog}
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t.buyer.cart.title}</h1>
        <p className="text-text-dim text-sm mt-1">{t.buyer.cart.itemCount(lines.length)}</p>
      </header>

      <div className="space-y-3 mb-6">
        {lines.map((line) => (
          <Card key={line.product.id}>
            <CardBody className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{line.product.name}</p>
                <p className="text-sm text-text-dim"> {formatCurrency(line.product.price)} {t.buyer.cart.perUnit}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setQuantity(line.product.id, Math.max(1, line.quantity - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-8 text-center font-medium">{line.quantity}</span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    setQuantity(
                      line.product.id,
                      Math.min(line.product.availableQuantity, line.quantity + 1)
                    )
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <span className="w-24 text-right font-semibold">
                {formatCurrency(line.product.price * line.quantity)}
              </span>
              <Button variant="ghost" size="icon" onClick={() => remove(line.product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-dim">{t.buyer.cart.total}</p>
            <p className="text-2xl font-semibold">{formatCurrency(total())}</p>
          </div>
          <div className="text-right">
            {error && <p className="text-sm text-danger mb-2">{error}</p>}
            <Button size="lg" loading={createOrder.isPending} onClick={handleCheckout}>
              {t.buyer.cart.checkout}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
