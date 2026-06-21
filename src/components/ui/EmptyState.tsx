import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-surface-2 p-3 text-text-dim">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-medium text-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-dim">{description}</p>}
      {action}
    </div>
  );
}
