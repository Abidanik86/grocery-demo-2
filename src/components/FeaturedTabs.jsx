import { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES, CATEGORY_ICONS } from '../data/categories';
import { PRODUCTS, productsByCategory } from '../data/catalog';
import ProductRail from './ProductRail';

const TABS = CATEGORIES.filter((category) => category.id !== 'all').slice(0, 5);

/** Totals come from the whole catalogue, not the currently visible slice. */
const TAB_COUNTS = TABS.reduce((counts, tab) => {
  counts[tab.id] = PRODUCTS.filter((product) => product.category === tab.id).length;
  return counts;
}, {});

export default function FeaturedTabs({
  copy,
  lang,
  selectedVariants,
  onSelectVariant,
  qtyOf,
  onAdd,
  onIncrement,
  onDecrement,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onSeeAll,
}) {
  const [active, setActive] = useState(TABS[0].id);

  const products = useMemo(() => productsByCategory(active), [active]);
  const current = TABS.find((tab) => tab.id === active);

  return (
    <section id="featured" className="relative py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-action-soft/60 to-transparent"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-[12px] font-black uppercase tracking-[0.14em] text-brand">
              <Sparkles className="h-4 w-4" strokeWidth={2.6} />
              {copy.nav.shop}
            </span>
            <h2 className="mt-2 text-[24px] xs:text-[27px] sm:text-[33px] font-black tracking-tight text-brand-deep">
              {copy.featured.title}
            </h2>
            <p className="mt-1 text-[14px] sm:text-[15.5px] font-medium text-muted">{copy.featured.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => onSeeAll(active)}
            className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-black text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white sm:self-auto shadow-sm"
          >
            <span>{copy.featured.viewAll}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.6}
            />
          </button>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2.5 overflow-x-auto pb-1.5">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            const count = TAB_COUNTS[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] sm:text-[14.5px] font-black transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-lift scale-[1.02]'
                    : 'border border-line/80 bg-surface text-ink/80 hover:border-brand/40 hover:text-brand'
                }`}
              >
                <span className="text-[17px]">{CATEGORY_ICONS[tab.icon]}</span>
                <span>{lang === 'bn' ? tab.bn : tab.en}</span>
                <span
                  className={`num rounded-full px-2 py-0.5 text-[11.5px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-line-soft text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {current && (
          <p className="mt-3 text-[12.5px] text-muted">
            {lang === 'bn' ? current.blurb.bn : current.blurb.en}
          </p>
        )}

        <div className="mt-5">
          <ProductRail
            copy={copy}
            lang={lang}
            products={products}
            selectedVariants={selectedVariants}
            onSelectVariant={onSelectVariant}
            qtyOf={qtyOf}
            onAdd={onAdd}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onQuickView={onQuickView}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={isWishlisted}
          />
        </div>
      </div>
    </section>
  );
}
