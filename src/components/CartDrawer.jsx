import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { taka } from '../lib/format';

export default function CartDrawer({
  copy,
  lang,
  open,
  onClose,
  detailedItems,
  totals,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onKeepShopping,
}) {
  useEffect(() => {
    if (!open) return undefined;
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
  }, [open, onClose]);

  const progress = Math.min(
    100,
    Math.round((totals.subtotal / 500) * 100),
  );

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
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-[420px] flex-col bg-surface shadow-pop transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={copy.cart.title}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-[16px] font-extrabold text-brand-deep">{copy.cart.title}</h2>
              <p className="num text-[11.5px] text-muted">
                {totals.itemCount} {copy.cart.items}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-colors hover:bg-line-soft hover:text-ink"
            aria-label={copy.nav.close}
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </header>

        {totals.itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-action-soft text-4xl">
              🛒
            </span>
            <p className="text-[16px] font-bold text-ink">{copy.cart.empty}</p>
            <p className="max-w-[24ch] text-[13px] text-muted">{copy.cart.emptyHint}</p>
            <button
              type="button"
              onClick={onKeepShopping}
              className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              {copy.cart.continue}
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery meter */}
            <div className="border-b border-line bg-action-soft/70 px-5 py-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-brand-deep">
                <Truck className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                {totals.freeGap > 0
                  ? copy.cart.freeHint.replace('{amount}', taka(totals.freeGap))
                  : copy.cart.freeReached}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-action to-mango transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="space-y-2.5">
                {detailedItems.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-3 rounded-2xl border border-line bg-canvas/60 p-2.5"
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
                          className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-line-soft hover:text-berry"
                          aria-label={copy.cart.remove}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                        <div className="flex items-center gap-1 rounded-lg border border-line bg-surface">
                          <button
                            type="button"
                            onClick={() => onDecrement(item.productId, item.variantId)}
                            className="grid h-7 w-7 place-items-center rounded-l-lg text-ink transition-colors hover:bg-line-soft"
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
                            className="grid h-7 w-7 place-items-center rounded-r-lg text-ink transition-colors hover:bg-line-soft"
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
            </div>

            <footer className="border-t border-line bg-canvas/70 px-5 py-4">
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
                className="mt-3.5 w-full rounded-xl bg-action py-3 text-[14px] font-extrabold text-white shadow-lift transition-colors hover:bg-action-dark"
              >
                {copy.cart.checkout}
              </button>
              <button
                type="button"
                onClick={onKeepShopping}
                className="mt-2 w-full rounded-xl border border-line bg-surface py-2.5 text-[13px] font-bold text-brand transition-colors hover:border-brand"
              >
                {copy.cart.continue}
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
