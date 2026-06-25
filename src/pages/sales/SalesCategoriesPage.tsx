import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import { useSalesCategories, useCreateSalesCategory } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useLocale } from '@/i18n/LocaleContext';

const PAGE_SIZE = 10;

export default function SalesCategoriesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useSalesCategories(page, PAGE_SIZE);
  const createCategory = useCreateSalesCategory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', description: '' , active: false});
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCategory.mutateAsync({ id : null, name: form.name, description: form.description || undefined, active : true });
    setOpen(false);
    setForm({id: null,  name: '', description: '' , active : true});
  }

  if (isLoading) return <FullPageSpinner />;

  const categories = data?.content ?? [];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.salesAdmin.categories.title}</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.salesAdmin.categories.newCategory}
        </Button>
      </header>

      {categories.length === 0 ? (
        <EmptyState icon={Tags} title="Nenhuma categoria cadastrada" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <Card key={c.id}>
                <CardBody>
                  <p className="font-medium">{c.name}</p>
                  {c.description && <p className="text-sm text-text-dim mt-1">{c.description}</p>}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Nova categoria">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.common.name}</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>{t.common.description}</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" loading={createCategory.isPending}>
            {t.common.save}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
