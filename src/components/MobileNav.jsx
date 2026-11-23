import { Grid2X2, Heart, Home, Search, ShoppingCart, User } from 'lucide-react';
import { taka } from '../lib/format';

/**
 * Bottom tab bar for phones.
 *
 * Each tab owns a full view (Home / Categories / Search / Account / Cart) so
 * the catalogue never has to be scrolled through end to end.
 */
export function MobileNav({ copy, activeTab, onTabChange, cartCount, wishlistCount }) {
  const tabs = [
    { id: 'home', icon: Home, label: copy.nav.home },
    { id: 'categories', icon: Grid2X2, label: copy.nav.categories },
    { id: 'search', icon: Search, label: copy.nav.searchBtn },
    { id: 'account', icon: User, label: copy.nav.account },
    { id: 'cart', icon: ShoppingCart, label: copy.nav.cart },
  ];

  return (
    <nav
      className="safe-bottom-full fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-surface/96 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden"
      aria-label={copy.nav.menu}
    >
      <ul className="flex items-stretch px-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          const badge = tab.id === 'cart' ? cartCount : tab.id === 'account' ? wishlistCount : 0;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={active ? 'page' : undefined}
                className="group relative flex min-h-[58px] w-full flex-col items-center justify-center py-1.5 transition-all duration-200 active:scale-95"
              >
                {/* Top glow indicator */}
                {active && (
                  <span className="absolute top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-emerald-500 via-[#f07b1a] to-emerald-500 shadow-xs animate-pulse-gentle" />
                )}

                {/* Animated Icon Bubble */}
                <span
                  className={`relative grid h-8 w-11 place-items-center rounded-2xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-tr from-emerald-100 via-emerald-50 to-teal-100 text-brand-deep shadow-xs ring-1 ring-emerald-300/50 scale-105 -translate-y-0.5 animate-bounce-micro'
                      : 'text-gray-500 group-hover:text-gray-800 group-hover:scale-105'
                  }`}
                >
                  <Icon
                    className={`h-[22px] w-[22px] transition-transform duration-200 ${
                      active ? 'stroke-[2.7] text-emerald-700' : 'stroke-[2]'
                    }`}
                  />
                  {badge > 0 && (
                    <span className="num absolute -right-1 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-1 text-[10.5px] font-black text-white shadow-sm ring-2 ring-white">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </span>

                {/* Bangla Label with Increased Font Size */}
                <span
                  className={`mt-0.5 max-w-full truncate px-0.5 text-[12px] sm:text-[12.5px] tracking-tight transition-all duration-200 ${
                    active
                      ? 'font-black text-emerald-800 scale-[1.03]'
                      : 'font-bold text-gray-500 group-hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FloatingCartPill({ copy, totals, onOpenCart }) {
  if (totals.itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={onOpenCart}
      className="safe-bottom-full fixed bottom-[74px] left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full bg-gradient-to-r from-brand via-brand-light to-brand px-5 py-3 text-white shadow-lift ring-2 ring-white/30 transition-all active:scale-95 lg:hidden"
    >
      <span className="relative">
        <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={2.4} />
        <span className="num absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-berry px-1 text-[10px] font-black text-white shadow-sm ring-1 ring-white">
          {totals.itemCount}
        </span>
      </span>
      <span className="num text-[14px] font-black">{taka(totals.total)}</span>
      <span className="h-4 w-px bg-white/25" />
      <span className="text-[13px] font-extrabold text-amber-200">{copy.cart.checkout}</span>
    </button>
  );
}

export function WishlistDrawer({ copy, lang, open, onClose, products, onAdd, onRemove }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-brand-deep/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-[400px] flex-col bg-surface shadow-pop transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={copy.nav.wishlist}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-brand-deep">
            <Heart className="h-[18px] w-[18px] text-berry" strokeWidth={2.3} />
            {copy.nav.wishlist}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-[13px] font-bold text-brand hover:bg-line-soft"
          >
            {copy.nav.close}
          </button>
        </header>

        {products.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-action-soft text-4xl">
              💛
            </span>
            <p className="text-[15px] font-bold text-ink">{copy.featured.wishlist}</p>
            <p className="text-[13px] text-muted">{copy.cart.emptyHint}</p>
          </div>
        ) : (
          <ul className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-canvas/60 p-2.5"
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
                  <p className="num text-[13px] font-extrabold text-berry">
                    {product.price} ৳
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdd(product.id, product.variants[0].id)}
                    className="rounded-lg bg-action px-3 py-1.5 text-[11.5px] font-bold text-white transition-colors hover:bg-action-dark"
                  >
                    {copy.featured.addToCart}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="rounded-lg border border-line px-3 py-1.5 text-[11.5px] font-semibold text-muted transition-colors hover:text-berry"
                  >
                    {copy.cart.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}

export function MenuDrawer({ copy, lang, open, onClose, categories, onPickCategory, onOpenWishlist }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-brand-deep/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-[60] flex h-full w-full max-w-[340px] flex-col bg-surface shadow-pop transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label={copy.nav.menu}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[21px] font-black text-brand-deep tracking-tight">{copy.nav.menu}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-[15px] font-black text-brand hover:bg-line-soft transition-colors active:scale-95"
          >
            {copy.nav.close}
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto px-3.5 py-3.5">
          <ul className="space-y-1.5">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    onPickCategory(category.id);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left transition-all hover:bg-brand-soft hover:text-brand-deep active:scale-[0.98]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-art text-[22px] shadow-xs">
                    {category.icon}
                  </span>
                  <span className="text-[17px] font-black text-gray-950 tracking-tight">
                    {lang === 'bn' ? category.bn : category.en}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="my-4 h-px bg-line/80" />

          <ul className="space-y-1">
            {[copy.nav.trackOrder, copy.nav.help, copy.nav.account, copy.nav.contact].map(
              (item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl px-4 py-3 text-left text-[15.5px] font-black text-gray-900 transition-colors hover:bg-line-soft hover:text-brand active:scale-[0.98]"
                  >
                    {item}
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="border-t border-line p-3.5">
          <button
            type="button"
            onClick={() => {
              onOpenWishlist();
              onClose();
            }}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-berry/25 bg-rose-50/60 py-2.5 text-[15.5px] font-black text-berry transition-all hover:bg-rose-100/70 active:scale-[0.98]"
          >
            <Heart className="h-5 w-5" strokeWidth={2.6} />
            <span>{copy.nav.wishlist}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
