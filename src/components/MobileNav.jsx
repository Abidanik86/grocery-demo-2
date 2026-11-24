import {
  Grid2X2,
  Headphones,
  Heart,
  Home,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
} from 'lucide-react';
import { CATEGORY_THEMES } from '../data/categories';
import { taka } from '../lib/format';

/**
 * Bottom tab bar for phones.
 *
 * Each tab owns a full view (Home / Categories / Search / Account / Cart) so
 * the catalogue never has to be scrolled through end to end.
 */
export function MobileNav({ copy, activeTab, onTabChange, cartCount, wishlistCount }) {
  const tabs = [
    {
      id: 'home',
      icon: Home,
      label: copy.nav.home,
      bubble: 'bg-gradient-to-tr from-emerald-100 via-emerald-50 to-teal-100 text-emerald-800 ring-1 ring-emerald-300/60',
      activeText: 'text-emerald-800',
      activeIcon: 'text-emerald-700',
      bar: 'from-emerald-500 via-emerald-400 to-teal-500',
    },
    {
      id: 'categories',
      icon: Grid2X2,
      label: copy.nav.categories,
      bubble: 'bg-gradient-to-tr from-indigo-100 via-indigo-50 to-blue-100 text-indigo-800 ring-1 ring-indigo-300/60',
      activeText: 'text-indigo-800',
      activeIcon: 'text-indigo-700',
      bar: 'from-indigo-500 via-blue-400 to-indigo-500',
    },
    {
      id: 'search',
      icon: Search,
      label: copy.nav.searchBtn,
      bubble: 'bg-gradient-to-tr from-amber-100 via-amber-50 to-orange-100 text-amber-800 ring-1 ring-amber-300/60',
      activeText: 'text-amber-800',
      activeIcon: 'text-amber-700',
      bar: 'from-amber-500 via-orange-400 to-amber-500',
    },
    {
      id: 'account',
      icon: User,
      label: copy.nav.account,
      bubble: 'bg-gradient-to-tr from-purple-100 via-purple-50 to-pink-100 text-purple-800 ring-1 ring-purple-300/60',
      activeText: 'text-purple-800',
      activeIcon: 'text-purple-700',
      bar: 'from-purple-500 via-pink-400 to-purple-500',
    },
    {
      id: 'cart',
      icon: ShoppingCart,
      label: copy.nav.cart,
      bubble: 'bg-gradient-to-tr from-rose-100 via-rose-50 to-pink-100 text-rose-800 ring-1 ring-rose-300/60',
      activeText: 'text-rose-800',
      activeIcon: 'text-rose-700',
      bar: 'from-rose-500 via-red-400 to-pink-500',
    },
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
                  <span className={`absolute top-0.5 h-1 w-7 rounded-full bg-gradient-to-r ${tab.bar} shadow-xs animate-pulse-gentle`} />
                )}

                {/* Animated Icon Bubble */}
                <span
                  className={`relative grid h-8 w-11 place-items-center rounded-2xl transition-all duration-300 ${
                    active
                      ? `${tab.bubble} shadow-xs scale-105 -translate-y-0.5 animate-bounce-micro`
                      : 'text-gray-500 group-hover:text-gray-800 group-hover:scale-105'
                  }`}
                >
                  <Icon
                    className={`h-[22px] w-[22px] transition-transform duration-200 ${
                      active ? `stroke-[2.7] ${tab.activeIcon}` : 'stroke-[2]'
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
                      ? `font-black ${tab.activeText} scale-[1.03]`
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
            {categories.map((category) => {
              const theme = CATEGORY_THEMES[category.id] || {
                badge: 'bg-gradient-to-br from-emerald-50 to-emerald-100/90 text-emerald-800 border border-emerald-300/70 shadow-xs',
                hoverBg: 'hover:bg-emerald-50/80',
              };
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPickCategory(category.id);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-left transition-all ${theme.hoverBg} hover:shadow-xs active:scale-[0.98]`}
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[24px] ${theme.badge}`}>
                      {category.icon}
                    </span>
                    <span className="text-[17px] font-black text-gray-950 tracking-tight">
                      {lang === 'bn' ? category.bn : category.en}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-3.5 h-px bg-line/80" />

          <ul className="space-y-1.5">
            {[
              {
                id: 'trackOrder',
                label: copy.nav.trackOrder,
                icon: Truck,
                badge: 'bg-gradient-to-br from-blue-50 to-blue-100/90 text-blue-700 border border-blue-200/80',
                hover: 'hover:bg-blue-50/80',
              },
              {
                id: 'help',
                label: copy.nav.help,
                icon: Headphones,
                badge: 'bg-gradient-to-br from-teal-50 to-teal-100/90 text-teal-700 border border-teal-200/80',
                hover: 'hover:bg-teal-50/80',
              },
              {
                id: 'account',
                label: copy.nav.account,
                icon: User,
                badge: 'bg-gradient-to-br from-indigo-50 to-indigo-100/90 text-indigo-700 border border-indigo-200/80',
                hover: 'hover:bg-indigo-50/80',
              },
              {
                id: 'contact',
                label: copy.nav.contact,
                icon: Phone,
                badge: 'bg-gradient-to-br from-amber-50 to-amber-100/90 text-amber-700 border border-amber-200/80',
                hover: 'hover:bg-amber-50/80',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-left transition-all ${item.hover} hover:text-brand active:scale-[0.98]`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.badge} shadow-xs`}>
                      <Icon className="h-5 w-5 stroke-[2.4]" />
                    </span>
                    <span className="text-[16px] font-black text-gray-900 tracking-tight">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
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
