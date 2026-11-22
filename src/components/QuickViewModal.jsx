import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Maximize2,
  Minus,
  Plus,
  RotateCw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [product, onClose, lightboxOpen]);

  useEffect(() => {
    if (product) {
      setActiveVariant(variantId ?? product.variants[0].id);
      setSelectedImageIndex(0);
      setIsZoomActive(false);
      setLightboxOpen(false);
      setLightboxZoom(1);
    }
  }, [product, variantId]);

  if (!product) return null;

  const variant =
    product.variants.find((item) => item.id === activeVariant) ?? product.variants[0];
  const off = discountPercent(variant.price, product.oldPrice);
  const badge = product.badge ? BADGES[product.badge] : null;

  // Generate thumbnail views for the image preview experience
  const images = [
    { id: 'main', url: product.image, label: lang === 'bn' ? 'মূল ছবি' : 'Main View' },
    { id: 'zoom', url: product.image, label: lang === 'bn' ? 'ক্লোজ-আপ' : 'Close Up' },
  ];

  const currentImg = images[selectedImageIndex]?.url || product.image;

  const handleMouseMove = (e) => {
    if (!isZoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-brand-deep/65 backdrop-blur-[4px] transition-opacity"
          aria-hidden="true"
        />

        <div className="animate-pop-in relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-line-soft bg-surface shadow-pop sm:rounded-[28px]">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-line/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 items-center gap-1.5 rounded-full bg-brand-soft px-3 text-[11px] font-bold text-brand">
                <Sparkles className="h-3.5 w-3.5 text-action" />
                {lang === 'bn' ? 'দ্রুত প্রিভিউ ও বিবরণ' : 'Quick Preview & Details'}
              </span>
              {off > 0 && (
                <span className="num flex h-7 items-center rounded-full bg-berry px-2.5 text-[11px] font-extrabold text-white shadow-soft">
                  -{off}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-brand"
                title={lang === 'bn' ? 'শেয়ার করুন' : 'Share product'}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink transition-colors hover:bg-line hover:text-berry"
                aria-label={copy.nav.close}
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-0 md:grid-cols-12">
              {/* IMAGE PREVIEW COLUMN (5 or 6 cols on md) */}
              <div className="border-b border-line/60 bg-art/50 p-4 md:col-span-6 md:border-b-0 md:border-r md:p-6 lg:col-span-6">
                {/* Main Image Display with Zoom capability */}
                <div
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-soft sm:aspect-square"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZoomActive(true)}
                  onMouseLeave={() => setIsZoomActive(false)}
                >
                  <img
                    src={currentImg}
                    alt={lang === 'bn' ? product.name.bn : product.name.en}
                    className="h-full w-full object-cover transition-transform duration-300"
                    style={
                      isZoomActive
                        ? {
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            transform: 'scale(2.2)',
                            cursor: 'crosshair',
                          }
                        : undefined
                    }
                  />

                  {/* Badges on top of image */}
                  <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                    {badge && (
                      <span className="rounded-xl bg-gradient-to-r from-lime to-emerald-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-soft">
                        {lang === 'bn' ? badge.bn : badge.en}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-deep shadow-soft backdrop-blur">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                      {lang === 'bn' ? '১০০% আসল ও তাজা' : '100% Verified'}
                    </span>
                  </div>

                  {/* Fullscreen Lightbox Button & Zoom Hint */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-white/95 px-3 text-[11.5px] font-bold text-brand-deep shadow-lift backdrop-blur transition-transform hover:scale-105 active:scale-95"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-action" />
                      <span>{lang === 'bn' ? 'বড় করে দেখুন' : 'Full Preview'}</span>
                    </button>
                  </div>

                  {/* Zoom Lens indicator badge */}
                  <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-lg bg-black/60 px-2.5 py-1 text-[10.5px] font-semibold text-white/90 backdrop-blur md:block">
                    {isZoomActive
                      ? (lang === 'bn' ? '🔍 ২.২x জুম সক্রিয়' : '🔍 2.2x Zoom Active')
                      : (lang === 'bn' ? 'কার্সর আনলে জুম হবে' : 'Hover to magnify')}
                  </div>
                </div>

                {/* Thumbnails rail for image preview */}
                <div className="mt-3.5 flex items-center gap-2.5">
                  {images.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-action ring-2 ring-action/25 scale-105'
                          : 'border-line/80 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1.5 text-[11.5px] font-medium text-muted">
                    <Eye className="h-3.5 w-3.5 text-brand" />
                    <span>
                      {selectedImageIndex + 1} / {images.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS & ACTIONS COLUMN */}
              <div className="flex flex-col justify-between p-5 sm:p-7 md:col-span-6 lg:col-span-6">
                <div>
                  {/* Category breadcrumb */}
                  <div className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-wider text-action">
                    <span>Mudiwala Fresh</span>
                    <span>•</span>
                    <span className="text-muted">{product.category}</span>
                  </div>

                  {/* Product Title */}
                  <h2 className="mt-1.5 text-[22px] font-extrabold leading-snug text-brand-deep sm:text-[26px]">
                    {lang === 'bn' ? product.name.bn : product.name.en}
                  </h2>

                  {/* Rating & Reviews & Origin */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-amber-700 ring-1 ring-amber-200">
                      <Star className="h-3.5 w-3.5 fill-current text-amber-500" strokeWidth={0} />
                      {product.rating}
                    </span>
                    <span className="text-[12px] text-muted">
                      ({product.reviews} {copy.product.reviews})
                    </span>
                    {product.origin && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11.5px] font-semibold text-emerald-800">
                        📍 {lang === 'bn' ? product.origin.bn : product.origin.en}
                      </span>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="mt-4 flex items-baseline gap-3 rounded-2xl bg-canvas/80 p-3.5 ring-1 ring-line/50">
                    <span className="num text-[28px] font-black tracking-tight text-berry">
                      {taka(variant.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="num text-[15px] font-semibold text-muted line-through">
                        {taka(product.oldPrice)}
                      </span>
                    )}
                    {off > 0 && (
                      <span className="num rounded-lg bg-lime/15 px-2 py-0.5 text-[11.5px] font-bold text-lime ring-1 ring-lime/30">
                        {lang === 'bn' ? `সাশ্রয় ${taka(product.oldPrice - variant.price)}` : `Save ${taka(product.oldPrice - variant.price)}`}
                      </span>
                    )}
                    <span className="ml-auto text-[12px] font-medium text-muted">
                      {lang === 'bn' ? product.unit.bn : product.unit.en}
                    </span>
                  </div>

                  <p className="mt-3.5 text-[13px] leading-relaxed text-muted">
                    {copy.product.description}
                  </p>

                  {/* Variant Selection */}
                  {product.variants.length > 1 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-ink/80">
                          {copy.product.variant}:
                        </span>
                        <span className="text-[11.5px] font-semibold text-brand">
                          {lang === 'bn' ? variant.name.bn : variant.name.en}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.variants.map((item) => {
                          const isSelected = item.id === activeVariant;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setActiveVariant(item.id);
                                onSelectVariant(product.id, item.id);
                              }}
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? 'border-brand bg-gradient-to-r from-brand to-brand-light text-white shadow-soft scale-[1.02]'
                                  : 'border-line bg-canvas text-ink hover:border-brand/40'
                              }`}
                            >
                              <span className="text-[12.5px] font-bold">
                                {lang === 'bn' ? item.name.bn : item.name.en}
                              </span>
                              <span
                                className={`num text-[12px] font-bold ${
                                  isSelected ? 'text-amber-200' : 'text-berry'
                                }`}
                              >
                                {taka(item.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Delivery Info Strip */}
                  <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-brand-soft/70 px-3 py-2 text-[12px] font-semibold text-brand">
                    <Truck className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.4} />
                    <span>
                      {lang === 'bn'
                        ? 'আজই দ্রুত ডেলিভারি • ৫০০ ৳ অর্ডারে ফ্রি শিপিং'
                        : 'Express Delivery Today • Free on ৳500+'}
                    </span>
                  </div>
                </div>

                {/* Actions (Desktop) */}
                <div className="mt-6 hidden items-center gap-3 md:flex">
                  <div className="flex-1">
                    <QuantityActions
                      product={product}
                      variant={variant}
                      qty={qty}
                      copy={copy}
                      onAdd={onAdd}
                      onIncrement={onIncrement}
                      onDecrement={onDecrement}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-all ${
                      wished
                        ? 'border-berry bg-berry text-white shadow-berry scale-105'
                        : 'border-line bg-canvas text-ink hover:border-berry hover:text-berry'
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
              </div>
            </div>
          </div>

          {/* Sticky action bar for phones */}
          <div className="safe-bottom-full shrink-0 border-t border-line bg-surface px-4 py-3 md:hidden">
            <div className="flex items-center gap-2.5">
              <QuantityActions
                product={product}
                variant={variant}
                qty={qty}
                copy={copy}
                onAdd={onAdd}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                grow
              />
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-colors ${
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
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX PREVIEW */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white backdrop-blur-md animate-pop-in">
          {/* Top control bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {lang === 'bn' ? 'এইচডি ইমেজ প্রিভিউ' : 'HD Image Preview'}
              </p>
              <h3 className="truncate text-[15px] font-extrabold sm:text-[17px]">
                {lang === 'bn' ? product.name.bn : product.name.en}
              </h3>
            </div>

            {/* Lightbox controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.min(3, prev + 0.3))}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/25"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.max(0.8, prev - 0.3))}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/25"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/25"
                title="Reset zoom"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-berry text-white shadow-soft transition-colors hover:bg-berry/80"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Lightbox preview stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
            <img
              src={currentImg}
              alt={lang === 'bn' ? product.name.bn : product.name.en}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl transition-transform duration-200"
              style={{ transform: `scale(${lightboxZoom})` }}
            />
          </div>

          {/* Lightbox bottom info */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 text-[12px] text-white/70">
            <span>{variant.name[lang]} • {taka(variant.price)}</span>
            <span>{Math.round(lightboxZoom * 100)}%</span>
          </div>
        </div>
      )}
    </>
  );
}

function QuantityActions({
  product,
  variant,
  qty,
  copy,
  onAdd,
  onIncrement,
  onDecrement,
  grow = false,
}) {
  if (qty > 0) {
    return (
      <div
        className={`flex h-12 items-center gap-1 rounded-2xl border-2 border-brand bg-canvas px-1 shadow-soft ${
          grow ? 'flex-1' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => onDecrement(product.id, variant.id)}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-line"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" strokeWidth={3} />
        </button>
        <span className="num flex-1 text-center text-[15px] font-black text-brand-deep">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onIncrement(product.id, variant.id)}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-line"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAdd(product.id, variant.id)}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-action to-action-dark text-[14px] font-extrabold text-white shadow-lift transition-all hover:scale-[1.02] active:scale-[0.98] ${
        grow ? 'flex-1 px-4' : 'px-8'
      }`}
    >
      <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2.5} />
      {copy.product.addToCart}
    </button>
  );
}
