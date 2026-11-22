import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      className="animate-toast-in pointer-events-none fixed inset-x-0 top-[110px] z-[90] flex justify-center px-4 sm:top-[85px]"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-deep via-brand to-[#0e5c3e] px-4 py-3 text-white shadow-pop ring-1 ring-white/20">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-brand-deep shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-[13.5px] font-bold text-white">{message}</span>
      </div>
    </div>
  );
}
