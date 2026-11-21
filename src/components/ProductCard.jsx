import { useState } from 'react';
import { Heart, Minus, Plus, Scale, ShoppingCart, Star, Eye } from 'lucide-react';
import { BADGES } from '../data/categories';
import { discountPercent, taka } from '../lib/format';

const TONE_CLASS = {
  lime: 'bg-lime text-white',
  mango: 'bg-mango text-white',
  berry: 'bg-berry text-white',
  plum: 'bg-plum text-white',
  sky: 'bg-sky text-white',
  turmeric: 'bg-turmeric text-brand-deep',
};

export default function ProductCard({
  copy,
  lang,
  product,
  variant,
  qty,
  onAdd,
  onIncrement,
  onDecrement,
  onQuickView,
  onToggleWishlist,
  wished,
  onPickVariant,
  compact = false,
}) {
  const [failed, setFailed] = useState(false);
  const badge = product.badge ? BADGES[product.badge] : null;
  const off = discountPercent(variant.price, product.oldPrice);
  const inCart = qty > 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      {/* Media */}
      <div className="relative aspect-square overflow-hidden bg-art">
        {failed ? (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-line-soft to-art text-[40px]">
            🧺
          </div>
        ) : (
          <img
            src={product.image}
            alt={lang === 'bn' ? product.name.bn : product.name.en}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="num rounded-lg bg-berry px-2 py-0.5 text-[11px] font-extrabold text-white shadow-soft">
              -{off}%
            </span>
          )}
          {badge && (
            <span
              className={`rounded-lg px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide shadow-soft ${
                TONE_CLASS[badge.tone] ?? 'bg-brand text-white'
              }`}
            >
              {lang === 'bn' ? badge.bn : badge.en}
            </span>
          )}
        </div>

        {/* Hover actions — on touch devices they stay visible so they are
            actually reachable without a pointer. */}
        <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-center gap-1.5 transition-all duration-300 max-lg:opacity-100 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-deep shadow-soft transition-transform hover:scale-110"
            aria-label={copy.featured.quickView}
          >
            <Eye className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className={`grid h-9 w-9 place-items-center rounded-full shadow-soft transition-transform hover:scale-110 ${
              wished ? 'bg-berry text-white' : 'bg-white text-brand-deep'
            }`}
            aria-label={copy.featured.wishlist}
          >
            <Heart
              className="h-[17px] w-[17px]"
              strokeWidth={2.2}
              fill={wished ? 'currentColor' : 'none'}
            />
          </button>
          <button
            type="button"
            className="hidden h-9 w-9 place-items-center rounded-full bg-white text-brand-deep shadow-soft transition-transform hover:scale-110 lg:grid"
            aria-label={copy.featured.compare}
          >
            <Scale className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </button>
        </div>

        {/* Add to cart overlay — desktop only, where it can ride on the
            image. Touch layouts put the action in the card body instead. */}
        {!compact && (
          <div className="absolute inset-x-2 bottom-2 hidden transition-transform duration-300 lg:translate-y-[130%] lg:group-focus-within:translate-y-0 lg:group-hover:translate-y-0 lg:block">
            {inCart ? (
              <div className="flex h-9 items-center justify-between rounded-xl bg-brand px-1.5 shadow-lift">
                <button
                  type="button"
                  onClick={() => onDecrement(product.id, variant.id)}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <span className="num text-[13px] font-extrabold text-white">{qty}</span>
                <button
                  type="button"
                  onClick={() => onIncrement(product.id, variant.id)}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAdd(product.id, variant.id)}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-action text-[12.5px] font-extrabold text-white shadow-lift transition-colors hover:bg-action-dark"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2.6} />
                {copy.featured.addToCart}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-action-soft px-1.5 py-0.5 text-[10.5px] font-bold text-action-dark">
            <Star className="h-3 w-3 fill-current" strokeWidth={0} />
            {product.rating}
          </span>
          <span className="text-[10.5px] text-muted">
            ({product.reviews} {copy.product.reviews})
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-ink">
          {lang === 'bn' ? product.name.bn : product.name.en}
        </h3>

        {product.origin && (
          <p className="mt-1 truncate text-[11px] text-muted">
            {lang === 'bn' ? product.origin.bn : product.origin.en}
          </p>
        )}

        {!compact && product.variants.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.variants.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPickVariant(product.id, item.id)}
                className={`min-h-[28px] rounded-lg border px-1.5 py-1 text-[10.5px] font-semibold leading-none transition-colors ${
                  item.id === variant.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-line text-muted hover:border-brand/40 hover:text-brand'
                }`}
              >
                {lang === 'bn' ? item.name.bn : item.name.en}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div className="min-w-0">
            {product.oldPrice && (
              <span className="num block text-[11px] font-semibold text-muted line-through">
                {taka(product.oldPrice)}
              </span>
            )}
            <span className="num block text-[17px] font-extrabold leading-tight text-berry">
              {taka(variant.price)}
            </span>
            <span className="block text-[10.5px] text-muted">
              {lang === 'bn' ? product.unit.bn : product.unit.en}
            </span>
          </div>

          {/* Touch action sits in the card body where it cannot be missed
              or accidentally tapped over the product photo. On desktop the
              image overlay handles it, so the body copy steps aside. */}
          <div className={`flex shrink-0 flex-col items-end gap-1 ${compact ? '' : 'lg:hidden'}`}>
            {inCart ? (
              <div className="flex h-9 items-center gap-0.5 rounded-lg border border-line bg-canvas px-0.5">
                <button
                  type="button"
                  onClick={() => onDecrement(product.id, variant.id)}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink transition-colors hover:bg-line-soft"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <span className="num w-6 text-center text-[12px] font-bold text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrement(product.id, variant.id)}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink transition-colors hover:bg-line-soft"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAdd(product.id, variant.id)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-action text-white shadow-soft transition-colors hover:bg-action-dark"
                aria-label={copy.featured.addToCart}
              >
                <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
