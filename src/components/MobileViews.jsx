import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Heart,
  Minus,
  PackageOpen,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_ICONS } from '../data/categories';
import { PRODUCTS, productsByCategory } from '../data/catalog';
import { taka } from '../lib/format';
import FeatureStrip from './FeatureStrip';
import HeroSlider from './HeroSlider';
import ProductCard from './ProductCard';
import ProductRail from './ProductRail';

const CATEGORY_COUNTS = CATEGORIES.reduce((counts, category) => {
  counts[category.id] = productsByCategory(category.id).length;
  return counts;
}, {});

/**
 * Mobile-only tab views.
 *
 * On phones the catalogue is far too long to browse as one scroll, so the
 * bottom bar switches between four focused views: Home, Categories, Search
 * and Account. Every view is a self-contained scrolling panel.
 */
export function MobileHome({
  copy,
  lang,
  featuredProducts,
  selectedVariants,
  onSelectVariant,
  qtyOf,
  onAdd,
  onIncrement,
  onDecrement,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onOpenCategories,
  onSeeAll,
  onShop,
}) {
  return (
    <div className="pb-4">
      <HeroSlider copy={copy} lang={lang} onShop={onShop} />

      <FeatureStrip copy={copy} />

      <FeaturedRail
        copy={copy}
        lang={lang}
        products={featuredProducts}
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

      <section className="shell mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[21px] sm:text-[24px] font-black tracking-tight text-brand-deep">
              {copy.mobile.shopByCategory}
            </h2>
            <p className="mt-0.5 text-[13px] font-medium text-muted">
              {copy.catalog.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCategories}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-[13px] font-black text-brand transition-colors hover:bg-brand-soft"
          >
            {copy.mobile.viewAll}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
          {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onOpenCategories(category.id)}
              className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left shadow-soft transition-colors active:bg-action-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-art text-[22px]">
                {CATEGORY_ICONS[category.icon]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-black text-ink">
                  {lang === 'bn' ? category.bn : category.en}
                </span>
                <span className="num block text-[12px] font-bold text-muted">
                  {CATEGORY_COUNTS[category.id]} {copy.mobile.inCategory}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="shell mt-7">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[21px] sm:text-[24px] font-black tracking-tight text-brand-deep">
            {copy.catalog.title}
          </h2>
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-[13px] font-black text-brand transition-colors hover:bg-brand-soft"
          >
            {copy.mobile.viewAll}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              copy={copy}
              lang={lang}
              product={product}
              variant={
                product.variants.find((v) => v.id === selectedVariants[product.id]) ??
                product.variants[0]
              }
              qty={qtyOf(product.id, selectedVariants[product.id] ?? product.variants[0].id)}
              onAdd={onAdd}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              wished={isWishlisted(product.id)}
              onPickVariant={onSelectVariant}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onSeeAll}
          className="mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[13.5px] font-bold text-brand transition-colors active:bg-brand-soft"
        >
          {copy.mobile.browseProducts}
          <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
        </button>
      </section>
    </div>
  );
}

function FeaturedRail({
  copy,
  lang,
  products,
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
  const [active, setActive] = useState('vegetables-fruits');

  const tabs = CATEGORIES.filter((category) => category.id !== 'all');
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];
  const items = useMemo(() => productsByCategory(active), [active]);

  return (
    <section className="mt-4">
      <div className="shell">
        <h2 className="text-[21px] sm:text-[24px] font-black tracking-tight text-brand-deep">
          {copy.mobile.featured}
        </h2>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto px-3.5 pb-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[15px] sm:text-[16px] font-black transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-soft scale-[1.02]'
                  : 'border border-line bg-surface text-ink/85'
              }`}
            >
              <span className="text-[18px]">{CATEGORY_ICONS[tab.icon]}</span>
              <span>{lang === 'bn' ? tab.bn : tab.en}</span>
            </button>
          );
        })}
      </div>

      {current && (
        <p className="shell mt-2 text-[13px] font-medium text-muted">
          {lang === 'bn' ? current.blurb.bn : current.blurb.en}
        </p>
      )}

      <div className="shell mt-3">
        <ProductRail
          copy={copy}
          lang={lang}
          products={items}
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
    </section>
  );
}

export function MobileCategories({
  copy,
  lang,
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
  const products = useMemo(() => productsByCategory(activeCategory), [activeCategory]);
  const active = CATEGORIES.find((category) => category.id === activeCategory);

  return (
    <div className="pb-4">
      <section className="shell pt-4">
        <h2 className="text-[19px] font-extrabold tracking-tight text-brand-deep">
          {copy.mobile.shopByCategory}
        </h2>

        <div className="no-scrollbar -mx-3.5 mt-3 flex gap-2 overflow-x-auto px-3.5 pb-1">
          {CATEGORIES.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[14.5px] font-black transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-soft'
                    : 'border border-line bg-surface text-ink/85'
                }`}
              >
                <span className="text-[16px]">{CATEGORY_ICONS[category.icon]}</span>
                <span>{lang === 'bn' ? category.bn : category.en}</span>
                <span
                  className={`num rounded-full px-2 py-0.5 text-[11px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-line-soft text-muted'
                  }`}
                >
                  {CATEGORY_COUNTS[category.id]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="shell mt-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[19px] font-extrabold tracking-tight text-brand-deep">
              {active ? (lang === 'bn' ? active.bn : active.en) : copy.catalog.title}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">
              <span className="num">{products.length}</span> {copy.mobile.inCategory}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="h-8 w-8 text-action-dark" strokeWidth={1.8} />}
            title={copy.catalog.empty}
            hint={copy.catalog.emptyHint}
            action={
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition-colors active:bg-brand-deep"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
                {copy.catalog.reset}
              </button>
            }
          />
        ) : (
          <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
            {products.map((product) => {
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
        )}
      </section>
    </div>
  );
}

export function MobileSearch({
  copy,
  lang,
  query,
  onQueryChange,
  results,
  selectedVariants,
  onSelectVariant,
  qtyOf,
  onAdd,
  onIncrement,
  onDecrement,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onOpenCategories,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trimmed = query.trim();

  return (
    <div className="pb-4">
      <section className="shell pt-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            strokeWidth={2.2}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={copy.nav.searchPlaceholder}
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-11 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-action"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors active:bg-line-soft"
              aria-label={copy.nav.close}
            >
              <X className="h-4.5 w-4.5" strokeWidth={2.4} />
            </button>
          )}
        </div>

        {!trimmed && (
          <p className="mt-2.5 text-[12.5px] text-muted">{copy.mobile.searchHint}</p>
        )}
      </section>

      <section className="shell mt-4">
        {!trimmed ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-4 py-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-action-soft">
              <Search className="h-6 w-6 text-action-dark" strokeWidth={1.9} />
            </span>
            <p className="mt-3 text-[14px] font-bold text-ink">{copy.mobile.selectCategory}</p>
            <p className="mt-1 text-[12.5px] text-muted">{copy.mobile.searchHint}</p>
            <button
              type="button"
              onClick={onOpenCategories}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition-colors active:bg-brand-deep"
            >
              {copy.mobile.browse}
              <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
            </button>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="h-8 w-8 text-action-dark" strokeWidth={1.8} />}
            title={copy.mobile.noResults}
            hint={copy.mobile.noResultsHint}
          />
        ) : (
          <>
            <p className="text-[12.5px] text-muted">
              <span className="num">{results.length}</span> {copy.mobile.inCategory}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
              {results.map((product) => {
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
          </>
        )}
      </section>
    </div>
  );
}

export function MobileAccount({
  copy,
  lang,
  wishlistProducts,
  onAdd,
  onRemoveWishlist,
  onOpenMenu,
  area,
  areas,
  onAreaChange,
}) {
  return (
    <div className="pb-4">
      <section className="shell pt-4">
        <h2 className="text-[19px] font-extrabold tracking-tight text-brand-deep">
          {copy.nav.account}
        </h2>

        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left shadow-soft transition-colors active:bg-action-soft"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-bold text-ink">
                {copy.nav.menu}
              </span>
              <span className="block truncate text-[10.5px] text-muted">
                {copy.nav.help}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left shadow-soft transition-colors active:bg-action-soft"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-action-soft text-action-dark">
              <Truck className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-bold text-ink">
                {copy.nav.trackOrder}
              </span>
              <span className="block truncate text-[10.5px] text-muted">
                {copy.nav.contact}
              </span>
            </span>
          </button>
        </div>

        {/* Delivery area */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            {copy.order.area}
          </p>
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            {areas.map((item) => {
              const isActive = item.id === area;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAreaChange(item.id)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-colors ${
                    isActive
                      ? 'bg-brand text-white shadow-soft'
                      : 'border border-line bg-surface text-ink/80'
                  }`}
                >
                  {lang === 'bn' ? item.bn : item.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="shell mt-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[19px] font-extrabold tracking-tight text-brand-deep">
            {copy.nav.wishlist}
          </h2>
          {wishlistProducts.length > 0 && (
            <span className="num text-[12.5px] font-bold text-muted">
              {wishlistProducts.length}
            </span>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7 text-berry" strokeWidth={2} />}
            title={copy.mobile.emptyWishlist}
            hint={copy.mobile.emptyWishlistHint}
          />
        ) : (
          <ul className="mt-3 space-y-2">
            {wishlistProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft"
              >
                <img
                  src={product.image}
                  alt={lang === 'bn' ? product.name.bn : product.name.en}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-xl bg-art object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">
                    {lang === 'bn' ? product.name.bn : product.name.en}
                  </p>
                  <p className="num mt-0.5 text-[13px] font-extrabold text-berry">
                    {product.price} ৳
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdd(product.id, product.variants[0].id)}
                    className="rounded-lg bg-action px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors active:bg-action-dark"
                  >
                    {copy.featured.addToCart}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveWishlist(product.id)}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors active:text-berry"
                  >
                    {copy.cart.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function MobileCart({
  copy,
  lang,
  totals,
  detailedItems,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onKeepShopping,
}) {
  const progress = Math.min(100, Math.round((totals.subtotal / 500) * 100));

  if (totals.itemCount === 0) {
    return (
      <div className="pb-4">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7 text-brand" strokeWidth={2} />}
          title={copy.cart.empty}
          hint={copy.mobile.emptyCartHint}
          action={
            <button
              type="button"
              onClick={onKeepShopping}
              className="rounded-xl bg-brand px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors active:bg-brand-deep"
            >
              {copy.cart.continue}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <section className="shell pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[19px] font-extrabold tracking-tight text-brand-deep">
            {copy.mobile.yourCart}
          </h2>
          <span className="num text-[12.5px] font-bold text-muted">
            {totals.itemCount} {copy.cart.items}
          </span>
        </div>

        {/* Free delivery meter */}
        <div className="mt-3 rounded-2xl bg-action-soft/70 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold text-brand-deep">
            <Truck className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            <span className="min-w-0 flex-1">
              {totals.freeGap > 0
                ? copy.cart.freeHint.replace('{amount}', taka(totals.freeGap))
                : copy.cart.freeReached}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-action to-mango transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          {detailedItems.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-[74px] w-[74px] shrink-0 rounded-xl bg-art object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-ink">{item.name}</p>
                    <p className="truncate text-[11px] text-muted">{item.variantName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.productId, item.variantId)}
                    className="shrink-0 rounded-lg p-1.5 text-muted transition-colors active:bg-line-soft active:text-berry"
                    aria-label={copy.cart.remove}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                  <div className="flex items-center gap-1 rounded-lg border border-line bg-canvas">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.productId, item.variantId)}
                      className="grid h-8 w-8 place-items-center rounded-l-lg text-ink transition-colors active:bg-line-soft"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    <span className="num w-7 text-center text-[12.5px] font-bold text-ink">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.productId, item.variantId)}
                      className="grid h-8 w-8 place-items-center rounded-r-lg text-ink transition-colors active:bg-line-soft"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>
                  <span className="num text-[14px] font-extrabold text-berry">
                    {taka(item.lineTotal)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-4">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
          <dl className="space-y-1.5 text-[13px]">
            <div className="flex items-center justify-between">
              <dt className="text-muted">{copy.cart.subtotal}</dt>
              <dd className="num font-bold text-ink">{taka(totals.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">{copy.cart.delivery}</dt>
              <dd className="num font-bold text-lime">
                {totals.delivery === 0 ? copy.cart.freeDelivery : taka(totals.delivery)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2">
              <dt className="text-[14px] font-bold text-ink">{copy.cart.total}</dt>
              <dd className="num text-[19px] font-extrabold text-brand-deep">
                {taka(totals.total)}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onCheckout}
            className="mt-3.5 min-h-[48px] w-full rounded-xl bg-action text-[14px] font-extrabold text-white shadow-lift transition-colors active:bg-action-dark"
          >
            {copy.cart.checkout}
          </button>
          <button
            type="button"
            onClick={onKeepShopping}
            className="mt-2 min-h-[44px] w-full rounded-xl border border-line bg-surface text-[13px] font-bold text-brand transition-colors active:bg-brand-soft"
          >
            {copy.cart.continue}
          </button>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ icon, title, hint, action }) {
  return (
    <div className="mt-4 flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-line bg-surface/60 px-5 py-11 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-action-soft">
        {icon}
      </span>
      <p className="text-[14.5px] font-bold text-ink">{title}</p>
      <p className="max-w-[28ch] text-[12.5px] text-muted">{hint}</p>
      {action}
    </div>
  );
}

export const MOBILE_PRODUCT_COUNT = PRODUCTS.length;

/**
 * Routes the active mobile tab to its view. Kept separate so App can pick
 * between the tabbed layout and the full desktop page in one branch.
 */
export function MobileTabView({
  tab,
  copy,
  lang,
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
  searchQuery,
  onSearchQueryChange,
  searchResults,
  totals,
  onOpenMenu,
  onOpenCategories,
  onSeeAll,
  onShop,
  onCheckout,
  onKeepShopping,
  onRemoveItem,
  area,
  areas,
  onAreaChange,
  wishlistProducts,
  onRemoveWishlist,
}) {
  if (tab === 'categories') {
    return (
      <MobileCategories
        copy={copy}
        lang={lang}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
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
    );
  }

  if (tab === 'search') {
    return (
      <MobileSearch
        copy={copy}
        lang={lang}
        query={searchQuery}
        onQueryChange={onSearchQueryChange}
        results={searchResults}
        selectedVariants={selectedVariants}
        onSelectVariant={onSelectVariant}
        qtyOf={qtyOf}
        onAdd={onAdd}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onQuickView={onQuickView}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
        onOpenCategories={() => onOpenCategories('all')}
      />
    );
  }

  if (tab === 'account') {
    return (
      <MobileAccount
        copy={copy}
        lang={lang}
        wishlistProducts={wishlistProducts}
        onAdd={onAdd}
        onRemoveWishlist={onRemoveWishlist}
        onOpenMenu={onOpenMenu}
        area={area}
        areas={areas}
        onAreaChange={onAreaChange}
      />
    );
  }

  if (tab === 'cart') {
    return (
      <MobileCart
        copy={copy}
        lang={lang}
        totals={totals}
        detailedItems={totals.detailed}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemoveItem}
        onCheckout={onCheckout}
        onKeepShopping={onKeepShopping}
      />
    );
  }

  return (
    <MobileHome
      copy={copy}
      lang={lang}
      featuredProducts={PRODUCTS}
      selectedVariants={selectedVariants}
      onSelectVariant={onSelectVariant}
      qtyOf={qtyOf}
      onAdd={onAdd}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onQuickView={onQuickView}
      onToggleWishlist={onToggleWishlist}
      isWishlisted={isWishlisted}
      onOpenCategories={(categoryId) => onOpenCategories(categoryId)}
      onSeeAll={onSeeAll}
      onShop={onShop}
    />
  );
}
