import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type ToastType } from '@/store/toastStore';
import { cn } from '@/lib/utils';

const config: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  error:   { icon: AlertCircle,  bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800' },
  info:    { icon: Info,         bg: 'bg-blue-50',     border: 'border-blue-200',     text: 'text-blue-800' },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const c = config[t.type];
        const Icon = c.icon;
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
              'animate-in slide-in-from-right duration-300',
              c.bg, c.border
            )}
          >
            <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', c.text)} />
            <p className={cn('text-sm font-medium flex-1', c.text)}>{t.message}</p>
            <button onClick={() => dismiss(t.id)} className={cn('shrink-0 mt-0.5 cursor-pointer', c.text, 'opacity-60 hover:opacity-100')}>
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
