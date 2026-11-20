import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const ICONS = [Truck, RotateCcw, Headphones, ShieldCheck];

export default function FeatureStrip({ copy }) {
  const items = [
    copy.features.shipping,
    copy.features.refund,
    copy.features.support,
    copy.features.safe,
  ];

  return (
    <section className="relative z-20 -mt-px border-b border-line bg-gradient-to-r from-brand-deep via-brand to-[#1a6b4c] text-white">
      <div className="shell">
        <ul className="grid grid-cols-2 divide-x divide-white/12 md:grid-cols-4">
          {items.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <li
                key={item.title}
                className="flex items-center gap-3 px-2 py-3.5 sm:px-4 md:px-5 md:py-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/12 ring-1 ring-inset ring-white/20">
                  <Icon className="h-5 w-5 text-[#ffd489]" strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-bold leading-tight sm:text-[13px]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-white/65 sm:text-[11.5px]">
                    {item.text}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
