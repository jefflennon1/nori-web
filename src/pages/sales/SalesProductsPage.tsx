import { useEffect, useState } from 'react';
import { Plus, Boxes } from 'lucide-react';
import { useSalesProducts, useSalesCategories, useCreateSalesProduct } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Label, Select } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils';
import { useLocale } from '@/i18n/LocaleContext';
import type { CategorySalesDTO } from '@/types';

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
  const { t } = useLocale();

  const [categoryDTO, setCategoryDTO] = useState<CategorySalesDTO>();


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
     if (!categoryDTO) return;

    await createProduct.mutateAsync({
      id: null,
      name: form.name,
      category: categoryDTO,
      description: form.description || undefined,
      price: Number(form.price),
      availableQuantity: Number(form.availableQuantity),
      active: true
    });
    setOpen(false);
    setForm({ name: '', categoryId: '', description: '', price: '', availableQuantity: '' });
  }

    useEffect(()=>{
      if(categories){
       const cat = categories.content.find((item)=> item.id == form.categoryId);
       if(cat){
        setCategoryDTO(cat);
       }
      }
  }, [form.categoryId]);

  if (isLoading) return <FullPageSpinner />;
  const products = data?.content ?? [];
 

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t.salesAdmin.products.title}</h1>
          <p className="text-text-dim text-sm mt-1">{t.salesAdmin.products.subtitle}</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.salesAdmin.products.newProduct}
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
            <Label>{t.common.name}</Label>
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
              <option value="">{t.common.select}</option>
              {categories?.content.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t.common.description}</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t.salesAdmin.products.fieldPrice}</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label className='text-warning border-warning/50'>{t.salesAdmin.products.fieldAvailableQty}</Label>
              <Tooltip content={t.salesAdmin.products.fieldAboutAvailableQty}>
                <Input
                  disabled={true}
                  type="number"
                  required
                  value={0}
                  onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })}
                  className='text-warning border-warning/30'
                />
              </Tooltip>
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
