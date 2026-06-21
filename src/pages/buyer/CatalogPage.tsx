import { ShoppingCart, PackageSearch } from 'lucide-react';
import { useSalesProducts } from '@/hooks/useSales';
import { useCartStore } from '@/store/cartStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';

export default function CatalogPage() {
  const { data, isLoading } = useSalesProducts();
  const addToCart = useCartStore((s) => s.add);

  if (isLoading) return <FullPageSpinner />;

  const products = data?.content ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="text-text-dim text-sm mt-1">Produtos disponíveis para compra</p>
      </header>

      {products.length === 0 ? (
        <EmptyState icon={PackageSearch} title="Nenhum produto disponível" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const outOfStock = product.availableQuantity <= 0;
            return (
              <Card key={product.id} className="flex flex-col">
                <CardBody className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-tight">{product.name}</h3>
                    <Badge tone="accent">{product.category?.name}</Badge>
                  </div>
                  {product.description && (
                    <p className="text-sm text-text-dim line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
                    {outOfStock ? (
                      <Badge tone="danger">Sem estoque</Badge>
                    ) : (
                      <Badge tone="success">{product.availableQuantity} disp.</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    disabled={outOfStock}
                    onClick={() => addToCart(product)}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
