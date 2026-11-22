import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PROMO_BANNERS } from '../data/catalog';

const TONES = {
  lime: 'from-emerald-950/90 via-emerald-800/75 to-lime-600/40',
  turmeric: 'from-orange-950/90 via-amber-800/75 to-orange-500/40',
};

export default function PromoBanners({ copy, lang }) {
  return (
    <section className="pb-10 sm:pb-14">
      <div className="shell">
        <div className="grid gap-4 md:grid-cols-2">
          {PROMO_BANNERS.map((banner) => (
            <a
              key={banner.id}
              href={banner.href}
              className="group relative block h-44 overflow-hidden rounded-2xl shadow-soft sm:h-52"
            >
              <BannerImage banner={banner} />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${TONES[banner.tone] ?? TONES.lime}`}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">
                  {lang === 'bn' ? banner.text.bn : banner.text.en}
                </p>
                <h3 className="mt-1 max-w-[16ch] text-[19px] font-extrabold leading-tight text-white sm:text-[24px]">
                  {lang === 'bn' ? banner.title.bn : banner.title.en}
                </h3>
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[12px] font-extrabold text-brand-deep transition-transform group-hover:gap-2.5">
                  {lang === 'bn' ? banner.cta.bn : banner.cta.en}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.8} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerImage({ banner }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="absolute inset-0 bg-gradient-to-br from-brand via-[#1a6b4c] to-brand-deep"
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={banner.image}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}
