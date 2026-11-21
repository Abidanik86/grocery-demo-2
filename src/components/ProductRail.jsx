import { useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductRail({
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
  const trackRef = useRef(null);

  const scrollBy = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-rail-card]');
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    track.scrollBy({ left: direction * step * 2, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        track.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };
    track.addEventListener('wheel', onWheel, { passive: false });
    return () => track.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3.5 pb-2 sm:-mx-4 sm:gap-4 sm:px-4"
      >
        {products.map((product) => {
          const variantId = selectedVariants[product.id] ?? product.variants[0].id;
          return (
            <div
              key={product.id}
              data-rail-card
              className="w-[calc(50%-0.375rem)] shrink-0 snap-start xs:w-[calc(50%-0.5rem)] sm:w-[218px] lg:w-[236px]"
            >
              <ProductCard
                copy={copy}
                lang={lang}
                product={product}
                variant={product.variants.find((v) => v.id === variantId) ?? product.variants[0]}
                qty={qtyOf(product.id, variantId)}
                onAdd={onAdd}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                wished={isWishlisted(product.id)}
                onPickVariant={onSelectVariant}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        className="absolute -left-3 top-[42%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-brand-deep shadow-soft transition-all hover:bg-brand hover:text-white md:grid"
        aria-label="Scroll left"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        className="absolute -right-3 top-[42%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-brand-deep shadow-soft transition-all hover:bg-brand hover:text-white md:grid"
        aria-label="Scroll right"
      >
        <ArrowRight className="h-5 w-5" strokeWidth={2.6} />
      </button>
    </div>
  );
}
