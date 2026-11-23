import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Globe,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import Logo from './icons/Logo';
import { takaCompact } from '../lib/format';

export default function Header({
  copy,
  lang,
  onLangChange,
  area,
  onAreaChange,
  areas,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenMenu,
  onOpenSearch,
  onTrackOrder,
  onSearch,
  searchResults,
  searchQuery,
  onSearchQueryChange,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const areaRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!areaOpen) return undefined;
    const onClick = (event) => {
      if (!areaRef.current?.contains(event.target)) setAreaOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [areaOpen]);

  const currentArea = areas.find((item) => item.id === area) ?? areas[0];

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement ticker */}
      <div className="hidden bg-gradient-to-r from-brand-deep via-brand to-[#0d593d] text-white/95 md:block border-b border-white/10">
        <div className="shell flex h-9 items-center justify-between text-[11.5px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <TruckIcon />
              {copy.topbar.freeShip}
            </span>
            <span className="hidden items-center gap-1.5 lg:flex text-amber-200 font-bold">
              🎉 কুপন কোড: <span className="rounded bg-white/20 px-1.5 py-0.5 text-white">MUDI10</span> দিয়ে ১০% ছাড়!
            </span>
            <span className="hidden items-center gap-1.5 lg:flex">
              <ShieldMini />
              {copy.topbar.secure}
            </span>
            <span className="hidden items-center gap-1.5 lg:flex">
              <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
              {copy.topbar.support}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLangChange}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-bold text-amber-200 transition-colors hover:bg-white/25"
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={2.2} />
              {copy.langToggle}
            </button>
            <button
              type="button"
              onClick={onTrackOrder}
              className="hidden text-white/90 hover:text-amber-200 transition-colors font-bold lg:inline"
            >
              {copy.nav.trackOrder}
            </button>
            <span className="hidden text-white/85 font-bold lg:inline">{copy.nav.help}</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b border-line bg-surface/95 backdrop-blur transition-shadow ${
          scrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="shell flex items-center gap-2 py-2.5 sm:gap-3 lg:gap-6 lg:py-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-line-soft lg:hidden"
            aria-label={copy.nav.menu}
          >
            <Menu className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <a href="#top" className="min-w-0 shrink-0">
            <Logo
              subtitleClassName="hidden sm:inline-flex"
              textClassName="flex"
            />
          </a>

          {/* Delivery area picker */}
          <div className="relative hidden lg:block" ref={areaRef}>
            <button
              type="button"
              onClick={() => setAreaOpen((open) => !open)}
              className="flex min-w-[190px] items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-left transition-colors hover:border-action/50"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                <span className="text-[13px]">📍</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {copy.order.area}
                </span>
                <span className="block truncate text-[14px] font-black text-ink">
                  {lang === 'bn' ? currentArea.bn : currentArea.en}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                  areaOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2.4}
              />
            </button>

            {areaOpen && (
              <div className="animate-slide-up absolute left-0 top-[calc(100%+8px)] z-50 w-60 overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
                <p className="border-b border-line-soft px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                  {copy.order.area}
                </p>
                <ul className="max-h-64 overflow-y-auto py-1">
                  {areas.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onAreaChange(item.id);
                          setAreaOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-action-soft ${
                          item.id === area
                            ? 'font-bold text-brand'
                            : 'text-ink/80'
                        }`}
                      >
                        {lang === 'bn' ? item.bn : item.en}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Search — full field on desktop, icon (which opens the Search
              tab) below the desktop breakpoint. */}
          <form
            className="relative hidden min-w-0 flex-1 lg:block"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(searchQuery);
            }}
          >
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
              strokeWidth={2.2}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={copy.nav.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-24 text-[13.5px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-action focus:bg-surface"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 rounded-lg bg-brand px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              {copy.nav.searchBtn}
            </button>

            {searchQuery.trim() && (
              <SearchResults
                copy={copy}
                lang={lang}
                results={searchResults}
                onSelect={() => onSearch(searchQuery)}
              />
            )}
          </form>
          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-line-soft lg:hidden"
              aria-label={copy.nav.searchBtn}
            >
              <Search className="h-[21px] w-[21px]" strokeWidth={2.1} />
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-line-soft"
              aria-label={copy.nav.wishlist}
            >
              <Heart className="h-[21px] w-[21px]" strokeWidth={2.1} />
              {wishlistCount > 0 && (
                <span className="num absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-berry px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="hidden h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-line-soft sm:grid"
              aria-label={copy.nav.account}
            >
              <User className="h-[21px] w-[21px]" strokeWidth={2.1} />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-action to-action-dark px-3 text-white shadow-lift transition-all hover:scale-105 active:scale-95 sm:px-4"
              aria-label={copy.nav.cart}
            >
              <span className="relative">
                <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={2.4} />
                {cartCount > 0 && (
                  <span className="num absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-berry px-1 text-[10px] font-black text-white ring-2 ring-white shadow-sm animate-pulse-gentle">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="num hidden text-[13.5px] font-black lg:inline">
                {takaCompact(cartTotal)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchResults({ copy, lang, results, onSelect }) {
  if (!results.length) {
    return (
      <div className="animate-slide-up absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-line bg-surface p-4 shadow-pop">
        <p className="text-[13px] text-muted">{copy.catalog.empty}</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-80 overflow-y-auto rounded-2xl border border-line bg-surface py-1.5 shadow-pop">
      {results.slice(0, 6).map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={onSelect}
          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-action-soft"
        >
          <img
            src={product.image}
            alt={product.name.en}
            className="h-11 w-11 shrink-0 rounded-lg bg-art object-cover"
            loading="lazy"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              {lang === 'bn' ? product.name.bn : product.name.en}
            </span>
            <span className="block text-[11.5px] text-muted">
              {lang === 'bn' ? product.origin.bn : product.origin.en}
            </span>
          </span>
          <span className="num shrink-0 text-[13px] font-bold text-berry">
            {product.price} ৳
          </span>
        </button>
      ))}
    </div>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

function ShieldMini() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 3l7 3v5c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3z" strokeLinejoin="round" />
    </svg>
  );
}
