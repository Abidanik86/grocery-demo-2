import { useMemo, useState } from 'react';
import { ChevronDown, LayoutGrid, PackageOpen, RotateCcw } from 'lucide-react';
import { CATEGORIES, CATEGORY_ICONS } from '../data/categories';
import { PRODUCTS } from '../data/catalog';
import { discountPercent } from '../lib/format';
import ProductCard from './ProductCard';

/** Total number of products in each category, independent of the active filter. */
const CATEGORY_COUNTS = CATEGORIES.reduce((counts, category) => {
  counts[category.id] =
    category.id === 'all'
      ? PRODUCTS.length
      : PRODUCTS.filter((product) => product.category === category.id).length;
  return counts;
}, {});

const SORTS = [
  'popular',
  'price-asc',
  'price-desc',
  'rating',
  'discount',
];

const PAGE_SIZE = 12;

export default function ProductGrid({
  copy,
  lang,
  products,
  activeCategory,
  onCategoryChange,
  selectedVariants,
  onSelectVariant,
  qtyOf,
  onAdd,
  onIncrement,
  onDecrement,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
}) {
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'price-asc') {
      list.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.variants[0].price - a.variants[0].price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      list.sort(
        (a, b) =>
          discountPercent(b.variants[0].price, b.oldPrice) -
          discountPercent(a.variants[0].price, a.oldPrice),
      );
    } else {
      list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [products, sort]);

  const shown = sorted.slice(0, visible);

  return (
    <section id="catalog" className="py-10 sm:py-14">
      <div className="shell">
        {/* Heading */}
        <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.6} />
              {copy.catalog.title}
            </span>
            <h2 className="mt-2.5 text-[24px] font-extrabold tracking-tight text-brand-deep sm:text-[31px]">
              {copy.catalog.title}
            </h2>
            <p className="mt-1 text-[13.5px] text-muted">{copy.catalog.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[12.5px] font-semibold text-muted" htmlFor="sort-select">
              {copy.catalog.sortLabel}
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 appearance-none rounded-xl border border-line bg-surface pl-3.5 pr-9 text-[13px] font-semibold text-ink outline-none transition-colors focus:border-action"
              >
                {SORTS.map((key) => (
                  <option key={key} value={key}>
                    {copy.catalog.sort[key]}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                strokeWidth={2.4}
              />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => {
            const active = category.id === activeCategory;
            const count = CATEGORY_COUNTS[category.id] ?? 0;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onCategoryChange(category.id);
                  setVisible(PAGE_SIZE);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-all ${
                  active
                    ? 'bg-brand text-white shadow-soft'
                    : 'border border-line bg-surface text-ink/80 hover:border-brand/40 hover:text-brand'
                }`}
              >
                <span className="text-[14px]">{CATEGORY_ICONS[category.icon]}</span>
                {lang === 'bn' ? category.bn : category.en}
                <span
                  className={`num rounded-full px-1.5 py-0.5 text-[10.5px] ${
                    active ? 'bg-white/20 text-white' : 'bg-line-soft text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface/60 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-action-soft text-3xl">
              <PackageOpen className="h-8 w-8 text-action-dark" strokeWidth={1.8} />
            </span>
            <p className="text-[15px] font-bold text-ink">{copy.catalog.empty}</p>
            <p className="text-[13px] text-muted">{copy.catalog.emptyHint}</p>
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
              {copy.catalog.reset}
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {shown.map((product) => {
                const variantId = selectedVariants[product.id] ?? product.variants[0].id;
                return (
                  <ProductCard
                    key={product.id}
                    copy={copy}
                    lang={lang}
                    product={product}
                    variant={
                      product.variants.find((v) => v.id === variantId) ?? product.variants[0]
                    }
                    qty={qtyOf(product.id, variantId)}
                    onAdd={onAdd}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    onQuickView={onQuickView}
                    onToggleWishlist={onToggleWishlist}
                    wished={isWishlisted(product.id)}
                    onPickVariant={onSelectVariant}
                  />
                );
              })}
            </div>

            {visible < sorted.length && (
              <div className="mt-9 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-line bg-surface px-7 text-[14px] font-bold text-brand transition-all hover:border-brand hover:bg-brand hover:text-white"
                >
                  {copy.catalog.showMore}
                  <ChevronDown className="h-4 w-4" strokeWidth={2.6} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
