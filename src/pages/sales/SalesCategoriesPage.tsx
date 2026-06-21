import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import { useSalesCategories, useCreateSalesCategory } from '@/hooks/useSales';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function SalesCategoriesPage() {
  const { data, isLoading } = useSalesCategories();
  const createCategory = useCreateSalesCategory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCategory.mutateAsync({ name: form.name, description: form.description || undefined });
    setOpen(false);
    setForm({ name: '', description: '' });
  }

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </header>

      {!data || data.length === 0 ? (
        <EmptyState icon={Tags} title="Nenhuma categoria cadastrada" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((c) => (
            <Card key={c.id}>
              <CardBody>
                <p className="font-medium">{c.name}</p>
                {c.description && <p className="text-sm text-text-dim mt-1">{c.description}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nova categoria">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" loading={createCategory.isPending}>
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
