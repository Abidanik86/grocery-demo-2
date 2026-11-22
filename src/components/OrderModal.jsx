import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Eye,
  Gift,
  HelpCircle,
  Lock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Printer,
  QrCode,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { AREAS, DELIVERY_SLOTS, PAYMENT_METHODS } from '../data/copy';
import { taka } from '../lib/format';

const ICONS = { wallet: Wallet, phone: Phone, card: CreditCard };

export default function OrderModal({
  copy,
  lang,
  open,
  onClose,
  totals,
  detailedItems = [],
  area,
  onAreaChange,
  onPlaceOrder,
}) {
  const [slot, setSlot] = useState(DELIVERY_SLOTS[0].id);
  const [payment, setPayment] = useState('bkash');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Payment specific states
  const [mfsProvider, setMfsProvider] = useState('bkash'); // 'bkash' | 'nagad' | 'rocket'
  const [mfsNumber, setMfsNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Card specific states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Coupon / Voucher discount
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Item preview modal / expand toggle
  const [showItemPreview, setShowItemPreview] = useState(true);
  const [previewingItem, setPreviewingItem] = useState(null);

  // ALL HOOKS MUST REMAIN UNCONDITIONALLY AT TOP (BEFORE ANY EARLY RETURN)
  const detectedCardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  }, [cardNumber]);

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

  // Early return is SAFE here because all hooks are declared above!
  if (!open) return null;

  // Calculate discounts
  let discountAmount = 0;
  let finalDelivery = totals.delivery;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((totals.subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.value;
    } else if (appliedCoupon.type === 'freeship') {
      finalDelivery = 0;
    }
  }

  const finalTotal = Math.max(0, totals.subtotal + finalDelivery - discountAmount);

  // Validation
  const validInfo = name.trim().length >= 2 && phone.trim().length >= 10 && address.trim().length >= 5;
  const validPayment =
    payment === 'cod' ||
    (payment === 'bkash' && (mfsNumber.trim().length >= 11 || trxId.trim().length >= 6)) ||
    (payment === 'card' && cardNumber.replace(/\s/g, '').length >= 14 && cardExpiry.trim().length >= 4);

  const canPlaceOrder = validInfo && validPayment;

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (code === 'MUDI10') {
      setAppliedCoupon({ code: 'MUDI10', type: 'percent', value: 10, label: '10% Discount' });
      setCouponError('');
    } else if (code === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', type: 'freeship', value: 0, label: 'Free Delivery' });
      setCouponError('');
    } else if (code === 'EIDVIBE') {
      setAppliedCoupon({ code: 'EIDVIBE', type: 'flat', value: 50, label: '৳50 Off' });
      setCouponError('');
    } else {
      setCouponError(lang === 'bn' ? 'সঠিক কুপন কোড দিন (যেমন: MUDI10, FREESHIP, EIDVIBE)' : 'Invalid code (try: MUDI10, FREESHIP, EIDVIBE)');
    }
  };

  const handleCopyNumber = (num) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2200);
    }
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4 md:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/70 backdrop-blur-[4px] transition-opacity"
        aria-hidden="true"
      />

      <div className="animate-pop-in relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-line-soft bg-surface shadow-pop sm:rounded-[28px]">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-line/80 bg-gradient-to-r from-brand via-brand-light to-brand-deep px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-amber-300 ring-1 ring-white/20">
              <ShoppingBag className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight">
                {lang === 'bn' ? 'অর্ডার প্রিভিউ ও পেমেন্ট' : 'Order Preview & Checkout'}
              </h2>
              <p className="text-[12px] text-white/80">
                {detailedItems.length} {copy.cart.items} • {taka(finalTotal)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20"
            aria-label={copy.nav.close}
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </header>

        {/* SCROLLABLE FORM CONTENT */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: VISUAL ORDER ITEMS PREVIEW */}
          <section className="rounded-2xl border border-line/70 bg-art/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand text-white text-[12px] font-bold">
                  ১
                </span>
                <span className="text-[13.5px] font-extrabold text-brand-deep">
                  {lang === 'bn' ? 'আপনার পণ্যের ছবি ও বিবরণ প্রিভিউ' : 'Ordered Items Preview'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowItemPreview((prev) => !prev)}
                className="text-[12px] font-bold text-[#f07b1a] transition-colors hover:text-[#d96b13]"
              >
                {showItemPreview ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'দেখান' : 'Show')}
              </button>
            </div>

            {showItemPreview && (
              <div className="mt-3.5">
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {detailedItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      onClick={() => setPreviewingItem(item)}
                      className="group relative flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-surface p-2 shadow-soft transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-art">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="num absolute bottom-1.5 right-1.5 rounded-md bg-brand-deep/85 px-1.5 py-0.5 text-[10px] font-black text-white">
                          × {item.qty}
                        </span>
                        <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-brand shadow-sm">
                          <Eye className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <div className="mt-2 min-w-0">
                        <p className="truncate text-[12px] font-bold text-ink">{item.name}</p>
                        <p className="truncate text-[10.5px] text-muted">{item.variantName}</p>
                        <p className="num mt-1 text-[12.5px] font-extrabold text-berry">
                          {taka(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-1.5 text-right text-[11px] text-muted">
                  💡 {lang === 'bn' ? 'যেকোনো পণ্যে ক্লিক করে বড় ছবি দেখুন' : 'Click any product for full image preview'}
                </p>
              </div>
            )}
          </section>

          {/* STEP 2: DELIVERY SLOT SELECTION */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand text-white text-[12px] font-bold">
                ২
              </span>
              <span className="text-[13.5px] font-extrabold text-brand-deep">
                {copy.order.slot}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {DELIVERY_SLOTS.map((option) => {
                const active = slot === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSlot(option.id)}
                    className={`flex flex-col rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? 'border-brand bg-gradient-to-br from-brand-soft to-white ring-2 ring-brand shadow-soft scale-[1.01]'
                        : 'border-line bg-canvas text-ink hover:border-brand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className={`h-4 w-4 ${active ? 'text-brand' : 'text-muted'}`} />
                      {active && <CheckCircle2 className="h-4 w-4 text-brand" />}
                    </div>
                    <span className="mt-2 block text-[12.5px] font-extrabold leading-tight text-ink">
                      {lang === 'bn' ? option.bnShort : option.enShort}
                    </span>
                    <span className="num mt-0.5 block text-[11px] text-muted">
                      {lang === 'bn' ? option.bnTime : option.enTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3: CUSTOMER & ADDRESS DETAILS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand text-white text-[12px] font-bold">
                ৩
              </span>
              <span className="text-[13.5px] font-extrabold text-brand-deep">
                {copy.order.deliveryTo}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার নাম *' : 'Your name *'}
                  className="h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-[14px] outline-none transition-colors focus:border-brand focus:bg-surface"
                />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={lang === 'bn' ? 'মোবাইল নম্বর (০১xxxxxxxxx) *' : 'Mobile number *'}
                  className="h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-[14px] outline-none transition-colors focus:border-brand focus:bg-surface"
                />
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => onAreaChange(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-[14px] font-medium outline-none transition-colors focus:border-brand focus:bg-surface"
                >
                  {AREAS.map((item) => (
                    <option key={item.id} value={item.id}>
                      📍 {lang === 'bn' ? item.bn : item.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'bn' ? 'বাসা, রোড ও ল্যান্ডমার্ক বিবরণ *' : 'House, Road & Landmark *'}
                  className="h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-[14px] outline-none transition-colors focus:border-brand focus:bg-surface"
                />
              </div>
            </div>
          </section>

          {/* STEP 4: INTERACTIVE PAYMENT SYSTEM */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand text-white text-[12px] font-bold">
                  ৪
                </span>
                <span className="text-[13.5px] font-extrabold text-brand-deep">
                  {copy.order.payment}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-lime">
                <ShieldCheck className="h-3.5 w-3.5" />
                {lang === 'bn' ? '১০০% নিরাপদ পেমেন্ট' : '100% Secure'}
              </span>
            </div>

            {/* PAYMENT TABS */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* bKash / MFS Tab */}
              <button
                type="button"
                onClick={() => setPayment('bkash')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all ${
                  payment === 'bkash'
                    ? 'border-[#E2136E] bg-pink-50/70 text-[#E2136E] ring-2 ring-[#E2136E] shadow-soft'
                    : 'border-line bg-canvas text-ink hover:border-[#E2136E]/40'
                }`}
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#D12053] to-[#E2136E] text-white shadow-sm font-black text-[13px]">
                  ৳
                </div>
                <span className="text-[12.5px] font-extrabold">bKash / Nagad</span>
                <span className="text-[10px] text-muted">MFS Wallet</span>
              </button>

              {/* Card Tab */}
              <button
                type="button"
                onClick={() => setPayment('card')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all ${
                  payment === 'card'
                    ? 'border-brand bg-brand-soft text-brand ring-2 ring-brand shadow-soft'
                    : 'border-line bg-canvas text-ink hover:border-brand/40'
                }`}
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-teal text-white shadow-sm">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-[12.5px] font-extrabold">Card</span>
                <span className="text-[10px] text-muted">Visa / Master / Amex</span>
              </button>

              {/* Cash On Delivery Tab */}
              <button
                type="button"
                onClick={() => setPayment('cod')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all ${
                  payment === 'cod'
                    ? 'border-[#f07b1a] bg-amber-50 text-[#f07b1a] ring-2 ring-[#f07b1a] shadow-soft'
                    : 'border-line bg-canvas text-ink hover:border-[#f07b1a]/40'
                }`}
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#f07b1a] to-amber-600 text-white shadow-sm">
                  <Wallet className="h-4 w-4" />
                </div>
                <span className="text-[12.5px] font-extrabold">{lang === 'bn' ? 'ক্যাশ' : 'COD'}</span>
                <span className="text-[10px] text-muted">Cash on delivery</span>
              </button>
            </div>

            {/* DYNAMIC PAYMENT METHOD BODY */}
            {payment === 'bkash' && (
              <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-4">
                {/* MFS provider tabs */}
                <div className="flex gap-2 mb-3">
                  {['bkash', 'nagad', 'rocket'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMfsProvider(p)}
                      className={`flex-1 rounded-xl py-1.5 text-[11.5px] font-black uppercase tracking-wider transition-all ${
                        mfsProvider === p
                          ? p === 'bkash'
                            ? 'bg-[#E2136E] text-white shadow-sm'
                            : p === 'nagad'
                            ? 'bg-[#F97316] text-white shadow-sm'
                            : 'bg-[#8C3494] text-white shadow-sm'
                          : 'bg-white text-ink/70 border border-line'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Merchant account info with copy button */}
                <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-pink-100">
                  <div>
                    <p className="text-[11px] font-semibold text-muted">
                      মুদিওয়ালা অফিসিয়াল মার্চেন্ট নম্বর ({mfsProvider.toUpperCase()}):
                    </p>
                    <p className="num text-[15px] font-black tracking-wider text-pink-700">
                      01799-MUDIWALA (01799683492)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber('01799683492')}
                    className="flex items-center gap-1 rounded-lg bg-pink-100 px-2.5 py-1.5 text-[11.5px] font-bold text-pink-700 transition-colors hover:bg-pink-200"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedNumber ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                  </button>
                </div>

                {/* Input fields for verification */}
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      {lang === 'bn' ? 'আপনার বিকাশ/নগদ নম্বর' : 'Your Sender Number'}
                    </label>
                    <input
                      type="tel"
                      value={mfsNumber}
                      onChange={(e) => setMfsNumber(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="h-11 w-full rounded-xl border border-pink-200 bg-white px-3.5 text-[14px] outline-none focus:border-[#E2136E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted mb-1">
                      {lang === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. 9J87K2L1"
                      className="h-11 w-full rounded-xl border border-pink-200 bg-white px-3.5 text-[14px] uppercase font-mono font-bold text-ink outline-none focus:border-[#E2136E]"
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-pink-800">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'অর্ডার প্লেস করার পর তাৎক্ষণিক ভেরিফাই হয়ে ডেলিভারি প্রসেস শুরু হবে।'
                      : 'Payment is verified immediately to speed up delivery packaging.'}
                  </span>
                </div>
              </div>
            )}

            {payment === 'card' && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                {/* 3D VIRTUAL PAYMENT CARD PREVIEW */}
                <div className="relative mx-auto aspect-[1.8/1] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-800 p-5 text-white shadow-xl ring-1 ring-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black tracking-widest text-amber-300">
                      MUDIWALA PAY
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-black tracking-wider text-white">
                      {detectedCardBrand}
                    </span>
                  </div>

                  {/* Chip & contactless wave */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-7 w-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner" />
                    <span className="text-white/60 text-[16px]">📶</span>
                  </div>

                  {/* Card number display */}
                  <div className="num mt-4 font-mono text-[17px] font-extrabold tracking-widest text-white/95 sm:text-[19px]">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Bottom info */}
                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/80">
                    <div>
                      <span className="block text-[9px] text-white/50">CARDHOLDER</span>
                      <span className="font-bold">{cardHolder || 'CUSTOMER NAME'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-white/50">EXPIRES</span>
                      <span className="num font-bold">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="Card Number (4xxx xxxx xxxx xxxx)"
                    className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[14px] font-mono outline-none focus:border-brand"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="Cardholder Name"
                      className="h-11 rounded-xl border border-line bg-white px-3.5 text-[13.5px] uppercase outline-none focus:border-brand"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="h-11 rounded-xl border border-line bg-white px-3 text-[13.5px] text-center font-mono outline-none focus:border-brand"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="CVV"
                        className="h-11 rounded-xl border border-line bg-white px-3 text-[13.5px] text-center font-mono outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <Lock className="h-3.5 w-3.5 text-brand" />
                  <span>Bank-grade 256-bit SSL encrypted. Card details are never stored.</span>
                </div>
              </div>
            )}

            {payment === 'cod' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f07b1a] text-white font-bold">
                    📦
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-amber-950">
                      {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)' : 'Cash on Delivery Guarantee'}
                    </h4>
                    <p className="mt-1 text-[12px] leading-relaxed text-amber-900/80">
                      {lang === 'bn'
                        ? 'কোনো অগ্রিম টাকা দিতে হবে না। ডেলিভারি রাইডার আপনার দরজায় পৌঁছালে সব পণ্য দেখে ক্যাশ অথবা যেকোনো কিউআর কোড স্ক্যান করে পেমেন্ট সম্পন্ন করতে পারবেন।'
                        : 'Zero advance required. Inspect your fresh groceries at your doorstep, then pay in cash or digital QR.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 5: PROMO / VOUCHER CODE */}
          <section className="rounded-2xl border border-line bg-canvas p-3.5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#f07b1a]" />
              <span className="text-[12.5px] font-bold text-ink">
                {lang === 'bn' ? 'ডিসকাউন্ট কুপন কোড' : 'Discount Coupon / Voucher'}
              </span>
            </div>

            <div className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={lang === 'bn' ? 'কুপন লিখুন (যেমন: MUDI10)' : 'Enter coupon (e.g. MUDI10)'}
                className="h-10 flex-1 rounded-xl border border-line bg-surface px-3 text-[13px] uppercase font-bold text-brand-deep outline-none focus:border-[#f07b1a]"
              />
              <button
                type="button"
                onClick={() => handleApplyCoupon()}
                className="h-10 rounded-xl bg-brand px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-deep"
              >
                {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
              </button>
            </div>

            {/* Quick Coupon Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted">{lang === 'bn' ? 'অফার কোড:' : 'Available:'}</span>
              {['MUDI10', 'FREESHIP', 'EIDVIBE'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setCouponCode(chip);
                    handleApplyCoupon(chip);
                  }}
                  className="rounded-lg border border-dashed border-[#f07b1a] bg-white px-2 py-0.5 text-[11px] font-bold text-[#f07b1a] hover:bg-amber-50"
                >
                  +{chip}
                </button>
              ))}
            </div>

            {couponError && (
              <p className="mt-2 text-[11.5px] font-medium text-berry">{couponError}</p>
            )}

            {appliedCoupon && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-100/70 px-3 py-1.5 text-[12px] font-bold text-emerald-800">
                <span>🎉 {appliedCoupon.code} applied: {appliedCoupon.label}</span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-berry hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </section>

          {/* TOTALS SUMMARY */}
          <section className="rounded-2xl bg-canvas p-4 ring-1 ring-line">
            <dl className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="text-muted">{copy.cart.subtotal}</dt>
                <dd className="num font-bold text-ink">{taka(totals.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">{copy.cart.delivery}</dt>
                <dd className="num font-bold text-lime">
                  {finalDelivery === 0 ? copy.cart.freeDelivery : taka(finalDelivery)}
                </dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-berry font-bold">
                  <dt>কুপন ছাড় ({appliedCoupon.code})</dt>
                  <dd className="num">-{taka(discountAmount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line pt-2.5">
                <dt className="text-[15px] font-black text-brand-deep">{copy.cart.total}</dt>
                <dd className="num text-[22px] font-black text-berry">
                  {taka(finalTotal)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* STICKY FOOTER CTA */}
        <footer className="safe-bottom-full shrink-0 border-t border-line/80 bg-surface px-5 py-3.5">
          <button
            type="button"
            disabled={!canPlaceOrder}
            onClick={() =>
              onPlaceOrder({
                name,
                phone,
                address,
                area,
                slot,
                payment,
                mfsProvider,
                mfsNumber,
                trxId,
                total: finalTotal,
                discount: discountAmount,
                coupon: appliedCoupon?.code || null,
                items: detailedItems,
              })
            }
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f07b1a] to-[#d96b13] text-[15px] font-black text-white shadow-lift transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>
              {copy.order.place} • {taka(finalTotal)}
            </span>
          </button>
        </footer>
      </div>

      {/* POPUP FULLSCREEN PREVIEW OF A SINGLE ORDER ITEM IF CLICKED */}
      {previewingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop-in">
          <div className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-5 text-center">
            <button
              type="button"
              onClick={() => setPreviewingItem(null)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink hover:bg-line"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={previewingItem.image}
              alt={previewingItem.name}
              className="w-full aspect-square object-cover rounded-2xl shadow-soft"
            />
            <h3 className="mt-3.5 text-[17px] font-extrabold text-brand-deep">
              {previewingItem.name}
            </h3>
            <p className="text-[13px] text-muted">{previewingItem.variantName}</p>
            <p className="num mt-2 text-[18px] font-black text-berry">
              {taka(previewingItem.price)} × {previewingItem.qty} = {taka(previewingItem.price * previewingItem.qty)}
            </p>
            <button
              type="button"
              onClick={() => setPreviewingItem(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-brand text-white font-bold text-[13px]"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close Preview'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AWESOME ORDER CONFIRMATION & LIVE ORDER TRACKER
 */
export function OrderConfirmModal({ copy, lang, order, onClose, onKeepShopping }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [activeStep, setActiveStep] = useState(2); // 1 = Received, 2 = Packing, 3 = On Way, 4 = Delivered

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

  const trackingSteps = [
    {
      id: 1,
      title: lang === 'bn' ? 'অর্ডার গ্রহণ সম্পন্ন' : 'Order Placed',
      time: '১০:৩০ AM',
      icon: CheckCircle2,
      desc: lang === 'bn' ? 'আমরা আপনার অর্ডার পেয়েছি' : 'Order confirmed by store',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
    },
    {
      id: 2,
      title: lang === 'bn' ? 'প্যাকেজিং ও বাছাই' : 'Quality Packing',
      time: '১০:৪৫ AM',
      icon: Package,
      desc: lang === 'bn' ? 'তাজা পণ্য বাছাই ও প্যাক করা হচ্ছে' : 'Fresh items inspected & packed',
      color: 'text-amber-500',
      bgColor: 'bg-[#f07b1a]',
    },
    {
      id: 3,
      title: lang === 'bn' ? 'ডেলিভারি রাইডার পথে' : 'Rider On The Way',
      time: '১১:১৫ AM',
      icon: Bike,
      desc: lang === 'bn' ? 'রাইডার রফিক আপনার দিকে রওনা দিচ্ছেন' : 'Rider is on the way',
      color: 'text-sky-500',
      bgColor: 'bg-sky-500',
    },
    {
      id: 4,
      title: lang === 'bn' ? 'দরজায় পৌঁছে দেওয়া' : 'Delivered',
      time: '১১:৪০ AM',
      icon: MapPin,
      desc: lang === 'bn' ? 'পণ্য হাতে পেয়ে দেখে নিন' : 'Arrived at your doorstep',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/80 backdrop-blur-[5px]"
        aria-hidden="true"
      />

      <div className="animate-pop-in relative max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-[32px] bg-surface text-center shadow-2xl border border-line-soft">
        {/* Floating Celebration Particles */}
        {showConfetti && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around overflow-hidden h-40 z-20">
            {['🎉', '✨', '🍃', '⭐', '🎈', '🎊', '🛵'].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 140}ms`, animationDuration: '1.5s' }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Hero Success Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand via-[#168a60] to-brand-deep px-6 py-8 text-white sm:py-9">
          {/* Subtle animated glowing orb in background */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-amber-400/20 blur-2xl" />

          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/20 ring-4 ring-white/30 shadow-xl backdrop-blur-md">
            <Check className="h-9 w-9 text-amber-300" strokeWidth={3.5} />
          </span>
          <h2 className="mt-3.5 text-[22px] font-black sm:text-[26px] tracking-tight">
            {copy.order.title}
          </h2>
          <p className="mt-1 text-[13.5px] text-white/90">
            {copy.order.thanks}
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-1.5 text-[13px] font-extrabold backdrop-blur-md ring-1 ring-white/20">
            <span className="text-white/80">{copy.order.id}:</span>
            <span className="num font-mono text-amber-300 tracking-wider">{order.id}</span>
          </div>
        </div>

        {/* SATISFYING INTERACTIVE LIVE ORDER TRACKER */}
        <div className="border-b border-line bg-gradient-to-b from-canvas to-surface px-5 py-6 sm:px-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-left">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-[15px] font-extrabold text-brand-deep">
                {lang === 'bn' ? 'লাইভ ডেলিভারি ট্র্যাকিং' : 'Live Delivery Tracker'}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11.5px] font-bold text-amber-800">
              <Clock className="h-3.5 w-3.5" />
              {lang === 'bn' ? 'আনুমানিক ৩৫-৪০ মিনিট' : 'Est. 35-40 mins'}
            </span>
          </div>

          {/* Connected timeline progress bar */}
          <div className="relative mt-6 mb-2">
            {/* Connecting progress line */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-line rounded-full" />
            <div
              className="absolute top-4 left-6 h-1 bg-gradient-to-r from-emerald-500 via-[#f07b1a] to-sky-500 rounded-full transition-all duration-700"
              style={{ width: `${((activeStep - 1) / 3) * 85}%` }}
            />

            {/* Steps icons row */}
            <div className="relative flex justify-between">
              {trackingSteps.map((step) => {
                const Icon = step.icon;
                const isPassed = activeStep >= step.id;
                const isCurrent = activeStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full text-white transition-all shadow-md ${
                        isCurrent
                          ? `${step.bgColor} ring-4 ring-amber-300/50 scale-110 animate-pulse`
                          : isPassed
                          ? 'bg-emerald-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.6} />
                    </span>
                    <span
                      className={`mt-2 block text-[11px] font-bold max-w-[70px] text-center leading-tight ${
                        isCurrent
                          ? 'text-brand-deep font-extrabold'
                          : isPassed
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="num mt-0.5 text-[9.5px] text-muted">
                      {step.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active step explanation box */}
          <div className="mt-5 rounded-2xl bg-white p-3.5 border border-line text-left flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-[#f07b1a]">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-extrabold text-brand-deep">
                  {trackingSteps[activeStep - 1].title}
                </p>
                <p className="text-[11.5px] text-muted">
                  {trackingSteps[activeStep - 1].desc}
                </p>
              </div>
            </div>
            <span className="num text-[11.5px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {trackingSteps[activeStep - 1].time}
            </span>
          </div>

          {/* Delivery Rider Card (Satisfying feature!) */}
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-3.5 border border-emerald-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white font-bold text-[14px]">
                  🛵
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-extrabold text-brand-deep">
                    {lang === 'bn' ? 'মোঃ রফিক আহমেদ' : 'Md. Rafiq Ahmed'}
                  </span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                    ⭐ 4.9
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  {lang === 'bn' ? 'মুদিওয়ালা এক্সপ্রেস ডেলিভারি পার্টনার' : 'Mudiwala Express Delivery Partner'}
                </p>
              </div>
            </div>

            <a
              href="tel:01700000000"
              className="flex items-center gap-1 rounded-xl bg-brand px-3 py-1.5 text-[12px] font-bold text-white shadow-soft transition-all hover:bg-brand-deep"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{lang === 'bn' ? 'কল দিন' : 'Call'}</span>
            </a>
          </div>
        </div>

        {/* ORDER SUMMARY & RECEIPT DETAILS */}
        <div className="p-5 sm:p-7 text-left space-y-4">
          {/* Ordered items preview thumbnails */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted mb-2">
                {lang === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ' : 'Purchased Items'}:
              </p>
              <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-line bg-canvas p-2 shrink-0 max-w-[200px]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover bg-white"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-bold text-ink">{item.name}</p>
                      <p className="num text-[10.5px] text-muted">
                        {item.qty} × {taka(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <dl className="space-y-2.5 rounded-2xl bg-canvas p-4 text-[13px] border border-line/70">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">{copy.order.slot}</dt>
              <dd className="text-right font-bold text-ink">{copy.order.slotValue}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">{copy.order.area}</dt>
              <dd className="text-right font-bold text-ink">{areaName}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">{copy.order.address}</dt>
              <dd className="text-right font-semibold text-ink">{order.address}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">{copy.order.phone}</dt>
              <dd className="num text-right font-bold text-ink">{order.phone}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">{copy.order.payment}</dt>
              <dd className="text-right font-extrabold uppercase text-[#f07b1a]">
                {order.payment === 'bkash' ? `bKash (${order.mfsProvider || 'MFS'})` : order.payment}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-t border-line pt-2.5">
              <dt className="text-[14px] font-bold text-ink">{copy.cart.total}</dt>
              <dd className="num text-right text-[20px] font-black text-berry">
                {taka(order.total)}
              </dd>
            </div>
          </dl>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface py-2.5 text-[12.5px] font-bold text-ink transition-colors hover:bg-canvas"
              >
                <Printer className="h-4 w-4" />
                <span>{lang === 'bn' ? 'রসিদ প্রিন্ট' : 'Print Receipt'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Mudiwala Order', text: `My Order ID: ${order.id}` });
                  }
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface py-2.5 text-[12.5px] font-bold text-ink transition-colors hover:bg-canvas"
              >
                <Share2 className="h-4 w-4" />
                <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share Order'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onKeepShopping}
              className="w-full rounded-2xl bg-gradient-to-r from-brand to-brand-light py-3.5 text-[14.5px] font-black text-white shadow-lift transition-all hover:scale-[1.01]"
            >
              {copy.order.keepShopping}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
