import { useState } from 'react';
import { Plus, ArrowLeftRight, ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react';
import { useMovements, useStockProducts, useSectors, useCreateMovement } from '@/hooks/useStock';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Label, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import type { MovementType } from '@/types';
import { useLocale } from '@/i18n/LocaleContext';
import type { Messages } from '@/i18n/messages.pt';

const typeMeta: Record<
  MovementType,
  { tone: 'success' | 'danger' | 'info'; icon: typeof ArrowDown; iconBg: string }
> = {
  INBOUND: { tone: 'success', icon: ArrowDown, iconBg: 'bg-success/10 text-success' },
  OUTBOUND: { tone: 'danger', icon: ArrowUp, iconBg: 'bg-danger/10 text-danger' },
  ADJUSTMENT: { tone: 'info', icon: SlidersHorizontal, iconBg: 'bg-accent-2/10 text-accent-2' },
};

function movementLabel(t: Messages, type: MovementType) {
  return t.stock.movements.type[type];
}

const PAGE_SIZE = 10;

export default function MovementsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useMovements(page, PAGE_SIZE);
  const { data: productsData } = useStockProducts();
  const { data: sectorsData } = useSectors();
  const createMovement = useCreateMovement();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    sectorId: '',
    type: 'INBOUND' as MovementType,
    quantity: '',
    reason: '',
  });
  const { t } = useLocale();

  const products = productsData?.content ?? [];
  const sectors = sectorsData?.content ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMovement.mutateAsync({
      productId: form.productId,
      sectorId: form.sectorId,
      type: form.type,
      quantity: Number(form.quantity),
      reason: form.reason || undefined,
    });
    setOpen(false);
    setForm({ productId: '', sectorId: '', type: 'INBOUND', quantity: '', reason: '' });
  }

  if (isLoading) return <FullPageSpinner />;

  const movements = data?.content ?? [];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t.stock.movements.title}</h1>
          <p className="text-text-dim text-sm mt-1">
            {t.stock.movements.subtitleBefore} <code>order-confirmed</code> {t.stock.movements.subtitleAfter}
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
           {t.stock.movements.newMovement}
        </Button>
      </header>

      {movements.length === 0 && page === 0 ? (
        <EmptyState icon={ArrowLeftRight} title={t.stock.movements.empty} />
      ) : (
        <>
          <div className="space-y-2">
            {movements.map((m) => {
              const meta = typeMeta[m.type];
              return (
                <Card key={m.id}>
                  <CardBody className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.iconBg}`}>
                        <meta.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{m.product.name}</p>
                        <p className="text-sm text-text-dim">
                          {m.sector.name} · {t.stock.movements.by} {m.user.username} · {formatDate(m.createdAt)}
                        </p>
                        {m.reason && <p className="text-xs text-text-dim">{m.reason}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={meta.tone}>{movementLabel(t, m.type)}</Badge>
                      <span className="font-semibold w-12 text-right">{m.quantity}</span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
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

      <Modal open={open} onClose={() => setOpen(false)} title="Nova movimentação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.stock.movements.fieldProduct}</Label>
            <Select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
              <option value="">{t.common.select}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t.stock.movements.fieldSector}</Label>
            <Select required value={form.sectorId} onChange={(e) => setForm({ ...form, sectorId: e.target.value })}>
              <option value="">{t.common.select}</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t.stock.movements.fieldType}</Label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as MovementType })}
              >
                <option value="INBOUND">{t.stock.movements.type.INBOUND}</option>
                <option value="ADJUSTMENT">{t.stock.movements.type.ADJUSTMENT}</option>
                <option value="OUTBOUND">{t.stock.movements.type.OUTBOUND}</option>
              </Select>
            </div>
            <div>
              <Label>{t.stock.movements.fieldQuantity}</Label>
              <Input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>{t.stock.movements.fieldReason}</Label>
            <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" loading={createMovement.isPending}>
            {t.stock.movements.register}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
