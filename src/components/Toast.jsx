import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      className="animate-toast-in pointer-events-none fixed inset-x-0 top-[124px] z-[90] flex justify-center px-4 sm:top-[92px]"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-2xl bg-brand-deep px-4 py-3 text-white shadow-pop">
        <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-lime" strokeWidth={2.6} />
        <span className="truncate text-[13px] font-semibold">{message}</span>
      </div>
    </div>
  );
}
