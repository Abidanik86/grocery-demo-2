import { useEffect, useState } from 'react';
import { Check, Heart, Minus, Plus, ShoppingCart, Star, Truck, X } from 'lucide-react';
import { BADGES } from '../data/categories';
import { discountPercent, taka } from '../lib/format';

export default function QuickViewModal({
  copy,
  lang,
  product,
  variantId,
  qty,
  onSelectVariant,
  onAdd,
  onIncrement,
  onDecrement,
  onToggleWishlist,
  wished,
  onClose,
}) {
  const [activeVariant, setActiveVariant] = useState(variantId ?? product?.variants[0]?.id);

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [product, onClose]);

  useEffect(() => {
    if (product) setActiveVariant(variantId ?? product.variants[0].id);
  }, [product, variantId]);

  if (!product) return null;

  const variant =
    product.variants.find((item) => item.id === activeVariant) ?? product.variants[0];
  const off = discountPercent(variant.price, product.oldPrice);
  const badge = product.badge ? BADGES[product.badge] : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/60 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      <div className="animate-pop-in relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-surface shadow-pop sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition-colors hover:bg-white"
          aria-label={copy.nav.close}
        >
          <X className="h-5 w-5" strokeWidth={2.4} />
        </button>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-art md:aspect-auto md:min-h-[420px]">
            <img
              src={product.image}
              alt={lang === 'bn' ? product.name.bn : product.name.en}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {off > 0 && (
                <span className="num rounded-lg bg-berry px-2.5 py-1 text-[12px] font-extrabold text-white">
                  -{off}%
                </span>
              )}
              {badge && (
                <span className="rounded-lg bg-lime px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {lang === 'bn' ? badge.bn : badge.en}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-7">
            <h3 className="text-[20px] font-extrabold leading-tight text-brand-deep sm:text-[24px]">
              {lang === 'bn' ? product.name.bn : product.name.en}
            </h3>

            <div className="mt-2 flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-action-soft px-2 py-1 text-[12px] font-bold text-action-dark">
                <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                {product.rating}
              </span>
              <span className="text-[12px] text-muted">
                {product.reviews} {copy.product.reviews}
              </span>
              {product.origin && (
                <>
                  <span className="text-line">•</span>
                  <span className="text-[12px] text-muted">
                    {lang === 'bn' ? product.origin.bn : product.origin.en}
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="num text-[26px] font-extrabold text-berry">
                {taka(variant.price)}
              </span>
              {product.oldPrice && (
                <span className="num text-[14px] font-semibold text-muted line-through">
                  {taka(product.oldPrice)}
                </span>
              )}
              <span className="text-[12px] text-muted">
                {lang === 'bn' ? product.unit.bn : product.unit.en}
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {copy.product.description}
            </p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mt-4">
                <p className="text-[12px] font-bold uppercase tracking-wider text-muted">
                  {copy.product.variant}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveVariant(item.id);
                        onSelectVariant(product.id, item.id);
                      }}
                      className={`rounded-xl border px-3 py-2 text-left transition-all ${
                        item.id === activeVariant
                          ? 'border-brand bg-brand text-white'
                          : 'border-line bg-canvas text-ink hover:border-brand/40'
                      }`}
                    >
                      <span className="block text-[12.5px] font-bold">
                        {lang === 'bn' ? item.name.bn : item.name.en}
                      </span>
                      <span
                        className={`num block text-[11.5px] ${
                          item.id === activeVariant ? 'text-white/75' : 'text-muted'
                        }`}
                      >
                        {taka(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-lime/12 px-2.5 py-1.5 text-[12px] font-bold text-lime">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {copy.product.inStock}
            </p>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {qty > 0 ? (
                <div className="flex h-12 items-center gap-1 rounded-xl border border-line bg-canvas px-1">
                  <button
                    type="button"
                    onClick={() => onDecrement(product.id, variant.id)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-ink transition-colors hover:bg-line-soft"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" strokeWidth={3} />
                  </button>
                  <span className="num w-8 text-center text-[14px] font-extrabold text-ink">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrement(product.id, variant.id)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-ink transition-colors hover:bg-line-soft"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(product.id, variant.id)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-action px-6 text-[14px] font-extrabold text-white shadow-lift transition-colors hover:bg-action-dark"
                >
                  <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2.5} />
                  {copy.product.addToCart}
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`grid h-12 w-12 place-items-center rounded-xl border transition-colors ${
                  wished
                    ? 'border-berry bg-berry text-white'
                    : 'border-line bg-canvas text-ink hover:border-berry/50 hover:text-berry'
                }`}
                aria-label={copy.featured.wishlist}
              >
                <Heart
                  className="h-5 w-5"
                  strokeWidth={2.2}
                  fill={wished ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-[12px] text-muted">
              <Truck className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.2} />
              {lang === 'bn'
                ? '৫০০ ৳ বা তার বেশি অর্ডারে ফ্রি ডেলিভারি'
                : 'Free delivery on orders over ৳500'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
