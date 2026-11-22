import { useState } from 'react';
import { Check, Mail, MapPin, Phone, Send, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from './icons/Logo';
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from './icons/SocialIcons';

const SOCIALS = [
  { id: 'facebook', Icon: FacebookIcon, label: 'Facebook' },
  { id: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
  { id: 'x', Icon: XIcon, label: 'X' },
  { id: 'youtube', Icon: YoutubeIcon, label: 'YouTube' },
];

const PAYMENT_BADGES = [
  { name: 'bKash', color: 'bg-gradient-to-r from-[#D12053] to-[#E2136E] text-white' },
  { name: 'Nagad', color: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white' },
  { name: 'Rocket', color: 'bg-gradient-to-r from-[#8C3494] to-[#7B2D83] text-white' },
  { name: 'Visa', color: 'bg-blue-700 text-white' },
  { name: 'Mastercard', color: 'bg-orange-600 text-white' },
  { name: 'Cash', color: 'bg-emerald-600 text-white' },
];

export default function Footer({ copy, lang }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const columns = [
    {
      title: copy.footer.shop,
      links: [
        { label: copy.nav.categories, href: '#catalog' },
        { label: copy.footer.aboutUs, href: '#catalog' },
        { label: copy.nav.offers, href: '#catalog' },
        { label: copy.nav.blog, href: '#catalog' },
      ],
    },
    {
      title: copy.footer.help,
      links: [
        { label: copy.footer.faq, href: '#catalog' },
        { label: copy.footer.returns, href: '#catalog' },
        { label: copy.footer.contact, href: '#catalog' },
        { label: copy.nav.trackOrder, href: '#catalog' },
      ],
    },
    {
      title: copy.footer.company,
      links: [
        { label: copy.footer.aboutUs, href: '#catalog' },
        { label: copy.footer.careers, href: '#catalog' },
        { label: copy.footer.privacy, href: '#catalog' },
        { label: copy.footer.terms, href: '#catalog' },
      ],
    },
  ];

  return (
    <footer className="relative mt-8 bg-gradient-to-b from-brand-deep via-[#082a1e] to-[#041a12] text-white/80">
      {/* Top warm decorative line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-[#f07b1a] to-emerald-500" aria-hidden="true" />

      {/* Newsletter Strip */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="shell py-8 sm:py-10">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/25">
                <Sparkles className="h-3 w-3" />
                {lang === 'bn' ? 'বিশেষ অফার ও ডিসকাউন্ট' : 'Special Offers & News'}
              </span>
              <h2 className="mt-2 text-[20px] font-black leading-tight text-white sm:text-[25px]">
                {copy.newsletter.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/70">{copy.newsletter.text}</p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-5 py-3.5 text-[13.5px] font-bold text-emerald-300 ring-1 ring-emerald-500/40">
                <Check className="h-5 w-5" />
                <span>{copy.newsletter.done}</span>
              </div>
            ) : (
              <form
                className="flex w-full max-w-md gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
              >
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-white/50"
                    strokeWidth={2.2}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.newsletter.placeholder}
                    className="h-12 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-3.5 text-[13.5px] text-white outline-none transition-all placeholder:text-white/45 focus:border-[#f07b1a] focus:bg-white/15 focus:ring-2 focus:ring-[#f07b1a]/30"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-[#f07b1a] px-5 text-[13.5px] font-black text-white shadow-lift transition-all hover:bg-[#d96b13] active:scale-95"
                >
                  <Send className="h-4 w-4" strokeWidth={2.4} />
                  <span className="hidden sm:inline">{copy.newsletter.cta}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div className="shell py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Brand & Contact Info */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-3.5 max-w-sm text-[13px] leading-relaxed text-white/70">
              {copy.footer.about}
            </p>

            <ul className="mt-4 space-y-2.5 text-[12.5px] text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#f07b1a] mt-0.5" strokeWidth={2.4} />
                <span>{lang === 'bn' ? 'বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা ১২০৫' : 'House 12, Road 5, Dhanmondi, Dhaka 1205'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#f07b1a]" strokeWidth={2.4} />
                <span className="num font-semibold">০১৬১১-০০০০০০</span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                {copy.footer.follow}
              </p>
              <ul className="mt-2.5 flex gap-2">
                {SOCIALS.map(({ id, Icon, label }) => (
                  <li key={id}>
                    <a
                      href="#top"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white/80 ring-1 ring-inset ring-white/15 transition-all hover:bg-[#f07b1a] hover:text-white hover:scale-105"
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links: Organized into 3 neat responsive columns */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-5">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col">
                <h3 className="text-[13px] font-black uppercase tracking-wider text-white border-b border-white/15 pb-2">
                  {column.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        className="block text-[13px] text-white/70 transition-colors hover:text-[#f07b1a] py-0.5 hover:translate-x-0.5 transform duration-150"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Payment & Security Section */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-black uppercase tracking-wider text-white border-b border-white/15 pb-2">
              {copy.footer.payment}
            </h3>
            <p className="mt-3 text-[12px] text-white/65">
              {lang === 'bn' ? '১০০% নিরাপদ ও ভেরিফায়েড পেমেন্ট মাধ্যম:' : '100% Secure & verified payment gateways:'}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {PAYMENT_BADGES.map((b) => (
                <span
                  key={b.name}
                  className={`rounded-lg py-1.5 text-center text-[11px] font-black tracking-wide shadow-xs ${b.color}`}
                >
                  {b.name}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] p-2.5 ring-1 ring-white/10">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-[11.5px] font-medium text-white/80">
                {lang === 'bn' ? 'নিরাপদ লেনদেন ও ক্যাশ অন ডেলিভারি' : 'Encrypted transactions & Doorstep COD'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="shell flex flex-col items-center justify-between gap-2 py-4 text-[12px] text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Mudiwala Grocery. {copy.footer.rights}
          </p>
          {/* <p>
            {copy.footer.photoCredit}:{' '}
            <a
              href="https://commons.wikimedia.org"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-[#f07b1a]"
            >
              Wikimedia Commons
            </a>
          </p> */}
        </div>
      </div>
    </footer>
  );
}
