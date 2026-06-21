import { useState } from 'react';
import { Plus, Boxes } from 'lucide-react';
import { useSalesProducts, useSalesCategories, useCreateSalesProduct } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Label, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils';

export default function SalesProductsPage() {
  const { data, isLoading } = useSalesProducts();
  const { data: categories } = useSalesCategories();
  const createProduct = useCreateSalesProduct();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    availableQuantity: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createProduct.mutateAsync({
      name: form.name,
      categoryId: form.categoryId,
      description: form.description || undefined,
      price: Number(form.price),
      availableQuantity: Number(form.availableQuantity),
    });
    setOpen(false);
    setForm({ name: '', categoryId: '', description: '', price: '', availableQuantity: '' });
  }

  if (isLoading) return <FullPageSpinner />;
  const products = data?.content ?? [];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-text-dim text-sm mt-1">Catálogo da loja</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </header>

      {products.length === 0 ? (
        <EmptyState icon={Boxes} title="Nenhum produto cadastrado" />
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <Card key={p.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-text-dim">{p.category?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={p.availableQuantity > 0 ? 'success' : 'danger'}>
                    {p.availableQuantity} em estoque
                  </Badge>
                  <span className="font-semibold w-24 text-right">{formatCurrency(p.price)}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo produto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Categoria</Label>
            <Select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Selecione...</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Qtd. disponível</Label>
              <Input
                type="number"
                required
                value={form.availableQuantity}
                onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" loading={createProduct.isPending}>
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
