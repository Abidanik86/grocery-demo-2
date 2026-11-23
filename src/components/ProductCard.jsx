import { useState } from 'react';
import { Eye, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { BADGES } from '../data/categories';
import { discountPercent, taka } from '../lib/format';

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
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1 ${
        inCart
          ? 'border-emerald-500/80 shadow-[0_8px_25px_-6px_rgba(16,185,129,0.28)] ring-1 ring-emerald-500/40'
          : 'border-line/80 shadow-soft hover:border-[#f07b1a]/50 hover:shadow-lift'
      }`}
    >
      {/* Square Media Container with Quick Preview on click */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-art cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        {failed ? (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-line-soft to-art text-[38px]">
            🧺
          </div>
        ) : (
          <img
            src={product.image}
            alt={lang === 'bn' ? product.name.bn : product.name.en}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        )}

        {/* Top Badges (Discount % & Badge) */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1 z-10 pointer-events-none">
          {off > 0 && (
            <span className="num rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-2 py-0.5 text-[10.5px] font-black text-white shadow-soft">
              -{off}%
            </span>
          )}
          {badge && (
            <span className="rounded-lg bg-brand-deep/85 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white shadow-soft">
              {lang === 'bn' ? badge.bn : badge.en}
            </span>
          )}
        </div>

        {/* Rating chip on image */}
        <div className="absolute bottom-2 left-2.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-1.5 py-0.5 text-[10.5px] font-bold text-gray-800 shadow-sm backdrop-blur-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-500" strokeWidth={0} />
            <span>{product.rating}</span>
          </span>
        </div>

        {/* Wishlist Heart Icon */}
        <div
          className="absolute right-2.5 top-2.5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className={`grid h-8 w-8 place-items-center rounded-full shadow-soft transition-all duration-200 hover:scale-110 active:scale-95 ${
              wished ? 'bg-berry text-white' : 'bg-white/90 text-brand-deep hover:bg-white'
            }`}
            aria-label={copy.featured.wishlist}
          >
            <Heart
              className="h-4 w-4"
              strokeWidth={2.4}
              fill={wished ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Quick View Hover overlay icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/15 pointer-events-none">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/95 text-brand-deep shadow-md">
            <Eye className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Body: Matches user reference image layout and proportions */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        {/* Title in Bangla */}
        <h3
          onClick={() => onQuickView(product)}
          className="line-clamp-1 text-[15.5px] sm:text-[16.5px] font-black text-gray-950 leading-snug cursor-pointer hover:text-[#f07b1a] transition-colors"
          title={lang === 'bn' ? product.name.bn : product.name.en}
        >
          {lang === 'bn' ? product.name.bn : product.name.en}
        </h3>

        {/* Subtitle in English */}
        <p className="line-clamp-1 text-[12.5px] sm:text-[13px] font-medium text-gray-500 mt-0.5">
          {lang === 'bn' ? product.name.en : (product.origin?.en || product.unit?.en)}
        </p>

        {/* Variant Pills Row (Matching reference image: 1kg, 5kg, 25kg) */}
        <div className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto py-0.5">
          {product.variants.map((item) => {
            const isSelected = item.id === variant.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPickVariant(product.id, item.id)}
                className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1 text-[11.5px] sm:text-[12px] font-bold transition-all ${
                  isSelected
                    ? inCart
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#f07b1a] text-white shadow-xs font-black'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang === 'bn' ? item.name.bn : item.name.en}
              </button>
            );
          })}
        </div>

        {/* Price Row: ৳375 ৳410 (Matching reference image) */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="num text-[20px] sm:text-[22px] font-black text-gray-950 tracking-tight">
            {taka(variant.price)}
          </span>
          {product.oldPrice && (
            <span className="num text-[13px] sm:text-[14px] font-semibold text-gray-400 line-through">
              {taka(product.oldPrice)}
            </span>
          )}
          {product.unit && (
            <span className="text-[11px] text-gray-500 font-medium ml-auto">
              {lang === 'bn' ? product.unit.bn : product.unit.en}
            </span>
          )}
        </div>

        {/* Cart Button: + যোগ করুন (Vibrant orange matching image, turns emerald on add) */}
        <div className="mt-3 pt-0.5">
          {inCart ? (
            <div className="flex h-11 w-full items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-2.5 text-white shadow-md ring-2 ring-emerald-400/40 animate-bounce-micro">
              <button
                type="button"
                onClick={() => onDecrement(product.id, variant.id)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/20 transition-all active:scale-90 text-white"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" strokeWidth={3} />
              </button>
              <div className="flex items-center gap-1.5 px-2">
                <span className="num text-[16px] font-black text-white">
                  {qty}
                </span>
                <span className="text-[12px] font-bold text-emerald-100">
                  {lang === 'bn' ? 'টি যোগ হয়েছে' : 'added'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onIncrement(product.id, variant.id)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/20 transition-all active:scale-90 text-white"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAdd(product.id, variant.id)}
              className="btn-shimmer-hover flex h-11 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#f07b1a] px-4 text-[14.5px] sm:text-[15.5px] font-black text-white shadow-soft transition-all hover:bg-[#e06d10] hover:scale-[1.01] active:scale-[0.98]"
            >
              <span className="text-[19px] font-black leading-none group-hover:scale-125 transition-transform">+</span>
              <span>{lang === 'bn' ? 'যোগ করুন' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
