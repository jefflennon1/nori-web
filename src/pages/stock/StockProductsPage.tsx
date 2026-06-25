import { useState } from 'react';
import { Plus, Boxes } from 'lucide-react';
import {
  useStockProducts,
  useStockCategories,
  useSectors,
  useCreateStockProduct,
} from '@/hooks/useStock';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Label, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useLocale } from '@/i18n/LocaleContext';

const PAGE_SIZE = 10;

export default function StockProductsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useStockProducts(page, PAGE_SIZE);
  const { data: categoriesData } = useStockCategories();
  const { data: sectorsData } = useSectors();
  const createProduct = useCreateStockProduct();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    sectorId: '',
    description: '',
    sku: '',
    quantity: '',
    minQuantity: '',
  });
  const { t } = useLocale();

  const categories = categoriesData?.content ?? [];
  const sectors = sectorsData?.content ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createProduct.mutateAsync({
      name: form.name,
      categoryId: form.categoryId,
      sectorId: form.sectorId,
      description: form.description || undefined,
      sku: form.sku || undefined,
      quantity: Number(form.quantity),
      minQuantity: Number(form.minQuantity),
    });
    setOpen(false);
    setForm({ name: '', categoryId: '', sectorId: '', description: '', sku: '', quantity: '', minQuantity: '' });
  }

  if (isLoading) return <FullPageSpinner />;

  const products = data?.content ?? [];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t.stock.products.title}</h1>
          <p className="text-text-dim text-sm mt-1">{t.stock.products.subtitle}</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.stock.products.newProduct}
        </Button>
      </header>

      {products.length === 0 && page === 0 ? (
        <EmptyState icon={Boxes} title={t.stock.products.empty} />
      ) : (
        <>
          <div className="space-y-2">
            {products.map((p) => (
              <Card key={p.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-text-dim">
                      {p.category?.name} · {p.sector?.name} {p.sku && `· ${p.sku}`}
                    </p>
                  </div>
                  <Badge tone={p.quantity <= p.minQuantity ? 'warning' : 'success'}>
                    {p.quantity} un. (mín. {p.minQuantity})
                  </Badge>
                </CardBody>
              </Card>
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={data?.totalElements ?? 0}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo produto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.common.name}</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t.salesAdmin.products.fieldCategory}</Label>
              <Select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">{t.common.select}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t.stock.products.fieldSector}</Label>
              <Select required value={form.sectorId} onChange={(e) => setForm({ ...form, sectorId: e.target.value })}>
                <option value="">{t.common.select}</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>{t.stock.products.fieldSku}</Label>
            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t.stock.products.fieldInitialQty}</Label>
              <Input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <Label>{t.stock.products.fieldMinQty}</Label>
              <Input type="number" required value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} />
            </div>
          </div>
          <Button type="submit" className="w-full" loading={createProduct.isPending}>
           {t.common.save}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
