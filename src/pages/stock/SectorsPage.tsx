import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useSectors, useCreateSector } from '@/hooks/useStock';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function SectorsPage() {
  const { data, isLoading } = useSectors();
  const createSector = useCreateSector();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', location: '' });

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

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Setores</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo setor
        </Button>
      </header>

      {!data || data.length === 0 ? (
        <EmptyState icon={MapPin} title="Nenhum setor cadastrado" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((s) => (
            <Card key={s.id}>
              <CardBody>
                <p className="font-medium">{s.name}</p>
                {s.location && <p className="text-sm text-text-dim mt-1">{s.location}</p>}
                {s.description && <p className="text-xs text-text-dim mt-1">{s.description}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo setor">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Localização</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" loading={createSector.isPending}>
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
