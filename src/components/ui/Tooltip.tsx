import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
             'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3',
              'w-96 max-w-[90vw] px-4 py-3 rounded-lg',
              'bg-white text-slate-700 border border-amber-300',
              'text-sm text-left leading-relaxed',
              'shadow-lg shadow-black/15',
              'animate-in fade-in duration-150',
            className
          )}
        >
          {content}
          <div
              className="
                absolute top-full left-1/2 -translate-x-1/2
                border-[7px] border-transparent border-t-amber-300
              "
            />

            <div
              className="
                absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]
                border-[6px] border-transparent border-t-white
              "
            />
        </div>
      )}
    </div>
  );
}
