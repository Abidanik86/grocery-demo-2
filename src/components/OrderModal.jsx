import { useEffect, useState } from 'react';
import { Check, CreditCard, MapPin, Phone, ShoppingBag, Truck, Wallet, X } from 'lucide-react';
import { AREAS, DELIVERY_SLOTS, PAYMENT_METHODS } from '../data/copy';
import { taka } from '../lib/format';

const ICONS = { wallet: Wallet, phone: Phone, card: CreditCard };

export default function OrderModal({
  copy,
  lang,
  open,
  onClose,
  totals,
  area,
  onAreaChange,
  onPlaceOrder,
}) {
  const [slot, setSlot] = useState(DELIVERY_SLOTS[0].id);
  const [payment, setPayment] = useState('cod');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

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

  if (!open) return null;

  const valid = name.trim() && phone.trim().length >= 10 && address.trim();

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/60 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      <div className="animate-pop-in relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface shadow-pop sm:rounded-3xl">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-action-soft text-action-dark">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <h2 className="text-[16px] font-extrabold text-brand-deep">
              {copy.order.place}
            </h2>
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

        <div className="space-y-4 px-5 py-5">
          <section>
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-muted">
              <Truck className="h-3.5 w-3.5" strokeWidth={2.4} />
              {copy.order.slot}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {DELIVERY_SLOTS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSlot(option.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-[12px] font-semibold transition-all ${
                    slot === option.id
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-canvas text-ink hover:border-brand/40'
                  }`}
                >
                  {lang === 'bn' ? option.bn : option.en}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-muted">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2.4} />
              {copy.order.deliveryTo}
            </p>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your name'}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[13.5px] outline-none transition-colors focus:border-action focus:bg-surface"
            />
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile number'}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[13.5px] outline-none transition-colors focus:border-action focus:bg-surface"
            />
            <select
              value={area}
              onChange={(event) => onAreaChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[13.5px] outline-none transition-colors focus:border-action focus:bg-surface"
            >
              {AREAS.map((item) => (
                <option key={item.id} value={item.id}>
                  {lang === 'bn' ? item.bn : item.en}
                </option>
              ))}
            </select>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={2}
              placeholder={lang === 'bn' ? 'বাসা, রোড ও ল্যান্ডমার্ক' : 'House, road and landmark'}
              className="w-full resize-none rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-action focus:bg-surface"
            />
          </section>

          <section>
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-muted">
              <CreditCard className="h-3.5 w-3.5" strokeWidth={2.4} />
              {copy.order.payment}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = ICONS[method.icon] ?? CreditCard;
                const active = payment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPayment(method.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? 'border-brand bg-brand-soft ring-1 ring-brand'
                        : 'border-line bg-canvas hover:border-brand/40'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${active ? 'text-brand' : 'text-muted'}`}
                        strokeWidth={2.2}
                      />
                      <span className="text-[12.5px] font-bold text-ink">
                        {lang === 'bn' ? method.bn : method.en}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-muted">
                      {lang === 'bn' ? method.bnSub : method.enSub}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-canvas px-4 py-3">
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
                <dd className="num text-[18px] font-extrabold text-brand-deep">
                  {taka(totals.total)}
                </dd>
              </div>
            </dl>
          </section>

          <button
            type="button"
            disabled={!valid}
            onClick={() => onPlaceOrder({ name, phone, address, area, slot, payment })}
            className="w-full rounded-xl bg-action py-3 text-[14px] font-extrabold text-white shadow-lift transition-colors hover:bg-action-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none"
          >
            {copy.order.place}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmModal({ copy, lang, order, onClose, onKeepShopping }) {
  useEffect(() => {
    if (!order) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [order, onClose]);

  if (!order) return null;

  const areaName = AREAS.find((item) => item.id === order.area)?.[lang] ?? order.area;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/65 backdrop-blur-[3px]"
        aria-hidden="true"
      />
      <div className="animate-pop-in relative w-full max-w-md overflow-hidden rounded-3xl bg-surface text-center shadow-pop">
        <div className="bg-gradient-to-br from-brand via-[#1a6b4c] to-brand-deep px-6 py-8 text-white">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 ring-4 ring-white/25">
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
          <h2 className="mt-4 text-[21px] font-extrabold">{copy.order.title}</h2>
          <p className="mt-1 text-[13px] text-white/75">{copy.order.thanks}</p>
          <p className="num mt-3 inline-block rounded-full bg-black/20 px-3.5 py-1.5 text-[13px] font-bold">
            {copy.order.id}: {order.id}
          </p>
        </div>

        <dl className="space-y-2.5 px-5 py-5 text-left text-[12.5px]">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">{copy.order.slot}</dt>
            <dd className="text-right font-semibold text-ink">{copy.order.slotValue}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">{copy.order.area}</dt>
            <dd className="text-right font-semibold text-ink">{areaName}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">{copy.order.address}</dt>
            <dd className="text-right font-semibold text-ink">{order.address}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">{copy.order.phone}</dt>
            <dd className="num text-right font-semibold text-ink">{order.phone}</dd>
          </div>
          <div className="flex items-start justify-between gap-3 border-t border-line pt-2.5">
            <dt className="text-muted">{copy.cart.total}</dt>
            <dd className="num text-right text-[16px] font-extrabold text-berry">
              {taka(order.total)}
            </dd>
          </div>
        </dl>

        <div className="flex gap-2.5 px-5 pb-5">
          <button
            type="button"
            onClick={onKeepShopping}
            className="flex-1 rounded-xl border border-line bg-canvas py-3 text-[13.5px] font-bold text-brand transition-colors hover:border-brand"
          >
            {copy.order.keepShopping}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-action py-3 text-[13.5px] font-extrabold text-white transition-colors hover:bg-action-dark"
          >
            {copy.order.track}
          </button>
        </div>
      </div>
    </div>
  );
}
