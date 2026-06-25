import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useSectors, useCreateSector } from '@/hooks/useStock';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useLocale } from '@/i18n/LocaleContext';

const PAGE_SIZE = 10;

export default function SectorsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useSectors(page, PAGE_SIZE);
  const createSector = useCreateSector();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', location: '' });
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createSector.mutateAsync({
      name: form.name,
      description: form.description || undefined,
      location: form.location || undefined,
    });
    setOpen(false);
    setForm({ name: '', description: '', location: '' });
  }

  if (isLoading) return <FullPageSpinner />;

  const sectors = data?.content ?? [];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.stock.sectors.title}</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.stock.sectors.newSector}
        </Button>
      </header>

      {sectors.length === 0 && page === 0 ? (
        <EmptyState icon={MapPin} title="Nenhum setor cadastrado" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectors.map((s) => (
              <Card key={s.id}>
                <CardBody>
                  <p className="font-medium">{s.name}</p>
                  {s.location && <p className="text-sm text-text-dim mt-1">{s.location}</p>}
                  {s.description && <p className="text-xs text-text-dim mt-1">{s.description}</p>}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Novo setor">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.common.name}</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>{t.stock.sectors.fieldLocation}</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>{t.common.description}</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" loading={createSector.isPending}>
            {t.common.save}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
