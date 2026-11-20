import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
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

const PAYMENT_BADGES = ['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'Cash'];

export default function Footer({ copy, lang }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const columns = [
    {
      title: copy.footer.shop,
      links: [
        copy.nav.categories,
        copy.footer.aboutUs,
        copy.nav.offers,
        copy.nav.blog,
      ],
    },
    {
      title: copy.footer.help,
      links: [
        copy.footer.faq,
        copy.footer.returns,
        copy.footer.contact,
        copy.nav.trackOrder,
      ],
    },
    {
      title: copy.footer.company,
      links: [
        copy.footer.aboutUs,
        copy.footer.careers,
        copy.footer.privacy,
        copy.footer.terms,
      ],
    },
  ];

  return (
    <footer className="relative mt-4 bg-brand-deep text-white/80">
      <div className="h-1 w-full rule-warm" aria-hidden="true" />

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="shell py-9">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="text-[21px] font-extrabold leading-tight text-white sm:text-[26px]">
                {copy.newsletter.title}
              </h2>
              <p className="mt-1.5 text-[13.5px] text-white/60">{copy.newsletter.text}</p>
            </div>

            {subscribed ? (
              <p className="inline-flex items-center gap-2 rounded-xl bg-lime/20 px-5 py-3.5 text-[13.5px] font-bold text-lime ring-1 ring-inset ring-lime/35">
                ✓ {copy.newsletter.done}
              </p>
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
                    className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-white/45"
                    strokeWidth={2.2}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.newsletter.placeholder}
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/8 pl-10 pr-3.5 text-[13.5px] text-white outline-none transition-colors placeholder:text-white/45 focus:border-action focus:bg-white/12"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-action px-5 text-[13.5px] font-extrabold text-white transition-colors hover:bg-action-dark"
                >
                  <Send className="h-4 w-4" strokeWidth={2.4} />
                  <span className="hidden sm:inline">{copy.newsletter.cta}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-3.5 max-w-sm text-[13px] leading-relaxed text-white/60">
            {copy.footer.about}
          </p>

          <ul className="mt-4 space-y-2 text-[12.5px] text-white/65">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-action" strokeWidth={2.2} />
              {lang === 'bn' ? 'বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা ১২০৫' : 'House 12, Road 5, Dhanmondi, Dhaka 1205'}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-action" strokeWidth={2.2} />
              <span className="num">০১৬১১-০০০০০০</span>
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
              {copy.footer.follow}
            </p>
            <ul className="mt-2.5 flex gap-2">
              {SOCIALS.map(({ id, Icon, label }) => (
                <li key={id}>
                  <a
                    href="#top"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 text-white/75 ring-1 ring-inset ring-white/12 transition-colors hover:bg-action hover:text-white"
                  >
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2.2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="lg:col-span-2">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-white">
              {column.title}
            </h3>
            <ul className="mt-3.5 space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#catalog"
                    className="text-[12.5px] text-white/60 transition-colors hover:text-action"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-2">
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-white">
            {copy.footer.payment}
          </h3>
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {PAYMENT_BADGES.map((badge) => (
              <li
                key={badge}
                className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[11px] font-semibold text-white/70 ring-1 ring-inset ring-white/10"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-4 text-[11.5px] text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Mudiwala. {copy.footer.rights}
          </p>
          <p>
            {copy.footer.photoCredit}:{' '}
            <a
              href="https://commons.wikimedia.org"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-action"
            >
              Wikimedia Commons
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
