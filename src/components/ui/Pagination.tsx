import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, totalElements, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLocale();

  if (totalElements === 0) return null;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-text-dim">
        {t.pagination.showing(from, to, totalElements)}
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.pagination.prev}
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {t.pagination.next}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
