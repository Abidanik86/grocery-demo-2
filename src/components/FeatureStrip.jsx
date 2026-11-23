import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    gradient: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-300',
    badge: '30-45 MIN',
  },
  {
    icon: RotateCcw,
    gradient: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-200',
    badge: '100% REFUND',
  },
  {
    icon: Headphones,
    gradient: 'from-sky-500 to-indigo-600',
    iconColor: 'text-sky-200',
    badge: '24/7 HELP',
  },
  {
    icon: ShieldCheck,
    gradient: 'from-rose-500 to-pink-600',
    iconColor: 'text-rose-200',
    badge: 'SECURE',
  },
];

export default function FeatureStrip({ copy }) {
  const items = [
    copy.features.shipping,
    copy.features.refund,
    copy.features.support,
    copy.features.safe,
  ];

  return (
    <section className="relative z-20 -mt-px border-b border-line bg-gradient-to-r from-brand-deep via-[#0e4832] to-[#12583d] text-white shadow-soft">
      <div className="shell py-2 sm:py-2.5">
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {items.map((item, index) => {
            const config = FEATURES[index];
            const Icon = config.icon;
            return (
              <li
                key={item.title}
                className="flex items-center gap-2.5 rounded-2xl bg-white/[0.07] p-2.5 sm:px-3 sm:py-3 transition-colors hover:bg-white/[0.12] ring-1 ring-white/10"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-sm`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-black leading-tight sm:text-[15.5px] text-white">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[12.5px] font-semibold leading-snug text-white/85 sm:text-[13.5px]">
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
