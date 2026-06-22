import { useLocale } from '@/i18n/LocaleContext';
import { cn } from '@/lib/utils';

export function LocaleSwitch({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cn('inline-flex rounded-md border border-border bg-surface-2 p-0.5 text-xs', className)}>
      {(['pt', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={cn(
            'rounded px-2 py-1 font-medium uppercase transition-colors cursor-pointer',
            locale === option ? 'bg-accent/15 text-accent' : 'text-text-dim hover:text-text'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
