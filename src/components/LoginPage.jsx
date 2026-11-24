import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
  MapPin,
  Phone,
  Store,
  User,
} from 'lucide-react';
import { AREAS } from '../data/copy';
import { BangladeshFlagIcon } from './LoginArtwork';

const FLOATING_FIREFLIES = [
  { top: '38%', left: '23%', size: 'h-2 w-2', dur: '5.2s', delay: '0s', color: 'bg-amber-200' },
  { top: '44%', left: '28%', size: 'h-1.5 w-1.5', dur: '6.4s', delay: '1.1s', color: 'bg-yellow-300' },
  { top: '32%', left: '26%', size: 'h-2.5 w-2.5', dur: '7.1s', delay: '2.3s', color: 'bg-amber-300' },
  { top: '54%', left: '21%', size: 'h-1.5 w-1.5', dur: '5.8s', delay: '0.6s', color: 'bg-orange-200' },
  { top: '68%', left: '16%', size: 'h-2 w-2', dur: '6.2s', delay: '1.8s', color: 'bg-amber-200' },
  { top: '34%', right: '24%', size: 'h-2 w-2', dur: '5.6s', delay: '0.9s', color: 'bg-amber-200' },
  { top: '48%', right: '29%', size: 'h-2.5 w-2.5', dur: '6.8s', delay: '1.7s', color: 'bg-yellow-200' },
  { top: '58%', right: '22%', size: 'h-1.5 w-1.5', dur: '5.4s', delay: '2.6s', color: 'bg-amber-300' },
  { top: '72%', right: '26%', size: 'h-2 w-2', dur: '6.5s', delay: '0.4s', color: 'bg-orange-200' },
  { top: '22%', left: '34%', size: 'h-1.5 w-1.5', dur: '7.5s', delay: '1.4s', color: 'bg-amber-100' },
  { top: '24%', right: '32%', size: 'h-1.5 w-1.5', dur: '6.9s', delay: '2.1s', color: 'bg-amber-100' },
];

/**
 * Normalizes a Bangladeshi mobile input so leading "0" or "+880" is stripped,
 * keeping at most 10 digits (e.g. "1799683492").
 */
function normalizeBdPhone(raw) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('880')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function isValidBdPhone(digits) {
  return /^1[3-9]\d{8}$/.test(digits);
}

export default function LoginPage({
  lang = 'bn',
  initialMode = 'login',
  onLangChange,
  onBack,
  onSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'otp' | 'register' | 'forgot'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Register state
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [area, setArea] = useState(AREAS[0].id);

  // Forgot password state
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cardActive, setCardActive] = useState(false);
  const parallaxRef = useRef(null);

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' || !parallaxRef.current) return;
    const x = (event.clientX / window.innerWidth - 0.5) * -18;
    const y = (event.clientY / window.innerHeight - 0.5) * -14;
    parallaxRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const resetParallax = () => {
    if (!parallaxRef.current) return;
    parallaxRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setInfo('');
    setOtpSent(false);
    setOtpCode('');
    setResetSent(false);
  };

  const handlePhoneChange = (event) => {
    setPhone(normalizeBdPhone(event.target.value));
    if (error) setError('');
  };

  const handlePasswordLogin = (event) => {
    event.preventDefault();
    if (!isValidBdPhone(phone)) {
      setError('সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন (যেমন: 1712345678)');
      return;
    }
    if (password.trim().length < 4) {
      setError('কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন / Enter at least 4 characters');
      return;
    }

    setError('');
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onSuccess?.({
        phone: `+880${phone}`,
        shopName: 'মায়ের দোয়া মুদি স্টোর',
        ownerName: 'পার্টনার মার্চেন্ট',
        area,
        mode: 'login',
      });
    }, 550);
  };

  const handleSendOtp = () => {
    if (!isValidBdPhone(phone)) {
      setError('OTP পেতে সঠিক মোবাইল নাম্বার দিন / Enter a valid BD number');
      return;
    }
    setError('');
    setOtpSent(true);
    setCountdown(30);
    setInfo(`আপনার +880${phone} নাম্বারে ৬ সংখ্যার OTP পাঠানো হয়েছে (Demo: 123456)`);
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (otpCode.trim().length < 4) {
      setError('প্রাপ্ত OTP কোডটি লিখুন / Enter the verification code');
      return;
    }
    setError('');
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onSuccess?.({
        phone: `+880${phone}`,
        shopName: 'বিসমিল্লাহ জেনারেল স্টোর',
        ownerName: 'পার্টনার মার্চেন্ট',
        area,
        mode: 'otp',
      });
    }, 500);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!shopName.trim() || !ownerName.trim()) {
      setError('দোকান ও মালিকের নাম লিখুন / Enter shop and owner name');
      return;
    }
    if (!isValidBdPhone(phone)) {
      setError('সঠিক মোবাইল নাম্বার দিন (যেমন: 1712345678)');
      return;
    }
    if (password.trim().length < 4) {
      setError('কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড সেট করুন');
      return;
    }
    setError('');
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onSuccess?.({
        phone: `+880${phone}`,
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        area,
        mode: 'register',
      });
    }, 600);
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    if (!resetSent) {
      if (!isValidBdPhone(phone)) {
        setError('সঠিক মোবাইল নাম্বার দিন / Enter your registered mobile number');
        return;
      }
      setError('');
      setResetSent(true);
      setInfo('পাসওয়ার্ড রিসেট কোড পাঠানো হয়েছে (Demo: 123456)');
      return;
    }
    if (otpCode.trim().length < 4 || newPassword.trim().length < 4) {
      setError('রিসেট কোড ও নতুন পাসওয়ার্ড দিন');
      return;
    }
    setError('');
    setInfo('পাসওয়ার্ড আপডেট হয়েছে! এখন লগইন করুন।');
    window.setTimeout(() => {
      setPassword(newPassword);
      switchMode('login');
      setInfo('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে — এখন লগইন করুন।');
    }, 800);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#10134a] text-white"
    >
      {/* Living interactive 2x backdrop with subtle pointer parallax + breathing drift */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      >
        <div
          ref={parallaxRef}
          className="h-full w-full transition-transform duration-500 ease-out will-change-transform"
        >
          <picture className="animate-bg-breathe block h-full w-full">
            <source
              media="(min-width: 640px) and (orientation: landscape)"
              srcSet="/images/login-bg-desktop-hd.jpg"
            />
            <img
              src="/images/login-bg-mobile-hd.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </div>

        {/* Dynamic warm light flares, pulsing scooter headlights & golden rim aura */}
        <div className="animate-glow-pulse absolute left-[18%] top-[34%] h-44 w-44 rounded-full bg-amber-400/20 blur-[55px] sm:h-64 sm:w-64" />
        <div
          className="animate-glow-pulse absolute right-[20%] top-[40%] h-48 w-48 rounded-full bg-amber-300/20 blur-[60px] sm:h-72 sm:w-72"
          style={{ animationDelay: '1.6s' }}
        />
        {/* Blue & Orange scooter headlight / storefront warm glow pulses */}
        <div
          className="animate-glow-pulse absolute bottom-[18%] left-[20%] hidden h-28 w-36 rounded-full bg-amber-300/25 blur-[36px] landscape:block"
          style={{ animationDelay: '0.8s' }}
        />
        <div
          className="animate-glow-pulse absolute bottom-[14%] right-[24%] h-28 w-36 rounded-full bg-amber-400/25 blur-[38px]"
          style={{ animationDelay: '2.2s' }}
        />

        {/* Subtle Wi-Fi / digital signal ripple rings */}
        <span className="animate-ripple-ping absolute bottom-[27%] left-[10%] hidden h-10 w-10 rounded-full border border-amber-300/45 landscape:block" />
        <span
          className="animate-ripple-ping absolute bottom-[24%] right-[28%] hidden h-10 w-10 rounded-full border border-pink-400/45 landscape:block"
          style={{ animationDelay: '1.7s' }}
        />

        {/* Floating golden firefly bokeh particles */}
        {FLOATING_FIREFLIES.map((dot, idx) => (
          <span
            key={idx}
            className={`animate-sparkle-float absolute rounded-full shadow-[0_0_12px_rgba(251,191,36,0.95)] ${dot.size} ${dot.color}`}
            style={{
              top: dot.top,
              left: dot.left,
              right: dot.right,
              animationDelay: dot.delay,
              '--dur': dot.dur,
            }}
          />
        ))}

        {/* Interactive golden aura behind center card — intensifies when typing */}
        <div
          className={`absolute left-1/2 top-[56%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] transition-all duration-700 ${
            cardActive ? 'bg-amber-400/22 scale-110' : 'bg-indigo-400/10 scale-100'
          }`}
        />
      </div>

      {/* Subtle top-left & top-right navigation controls (low profile so artwork shines) */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-3 pt-3 sm:px-6 sm:pt-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0d1545]/60 px-3 py-1.5 text-[12px] font-bold text-white/95 backdrop-blur-md transition-all hover:border-amber-300/55 hover:bg-[#152063]/80 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-amber-300" strokeWidth={2.4} />
            <span>{lang === 'bn' ? 'দোকানে ফিরুন' : 'Back to Store'}</span>
          </button>
        ) : (
          <span />
        )}

        {onLangChange && (
          <button
            type="button"
            onClick={onLangChange}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0d1545]/60 px-3 py-1.5 text-[12px] font-bold text-amber-200 backdrop-blur-md transition-all hover:border-amber-300/55 hover:bg-[#152063]/80 active:scale-95"
          >
            <Globe className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        )}
      </header>

      {/* Centered Logo + Tagline + Frosted Glass Card */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-8 sm:px-6 sm:pb-36 sm:pt-10 lg:pb-10 lg:pt-2">
        {/* Authentic Mudiwala Partner Logo + Bilingual Tagline */}
        <div className="animate-fade-up flex flex-col items-center text-center">
          <img
            src="/images/mudiwala-partner-logo.png"
            alt="Mudiwala"
            className="h-auto w-[215px] select-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] xs:w-[245px] sm:w-[300px] lg:w-[350px] xl:w-[380px]"
            loading="eager"
          />
          <p className="mt-1.5 px-2 text-[12.5px] font-semibold tracking-wide text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] xs:text-[13.5px] sm:text-[15.5px] lg:text-[16.5px]">
            আপনার ডিজিটাল মুদি স্টোর{' '}
            <span className="mx-1 text-white/60">|</span> The Digital Grocer’s Store
          </p>
        </div>

        {/* Frosted Glassmorphism Card matching the reference design */}
        <section
          aria-label="Merchant Login"
          onFocus={() => setCardActive(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setCardActive(false);
          }}
          className={`animate-pop-in relative mt-4 w-full max-w-[385px] rounded-[20px] border bg-[#151e52]/55 p-5 backdrop-blur-xl transition-all duration-500 xs:p-6 sm:mt-5 sm:max-w-[410px] sm:p-7 lg:max-w-[425px] ${
            cardActive
              ? 'border-amber-300/45 shadow-[0_28px_72px_rgba(3,6,26,0.82),0_0_56px_rgba(251,191,36,0.22)]'
              : 'border-white/25 shadow-[0_28px_72px_rgba(3,6,26,0.78),0_0_48px_rgba(251,191,36,0.12)]'
          }`}
        >
          {/* Warm vertical golden edge light streaks on card borders */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-px top-[22%] h-[56%] w-[2px] rounded-full bg-gradient-to-b from-transparent via-amber-200/85 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.9)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-px top-[26%] h-[48%] w-[1.5px] rounded-full bg-gradient-to-b from-transparent via-amber-200/45 to-transparent"
          />

          {/* Card Title */}
          <h1 className="text-center text-[18.5px] font-extrabold tracking-tight text-white drop-shadow-xs xs:text-[20px] sm:text-[22px]">
            {mode === 'register'
              ? 'দোকান রেজিস্টার / Register Shop'
              : mode === 'forgot'
                ? 'পাসওয়ার্ড রিসেট / Reset Password'
                : mode === 'otp'
                  ? 'OTP লগইন / Login with OTP'
                  : 'Login'}
          </h1>

          {/* Inline Error / Status Banners */}
          {error && (
            <div
              role="alert"
              className="mt-3.5 rounded-xl border border-rose-400/45 bg-rose-500/20 px-3.5 py-2.5 text-[12.5px] font-semibold text-rose-100"
            >
              {error}
            </div>
          )}
          {info && (
            <div
              role="status"
              className="mt-3.5 flex items-start gap-2 rounded-xl border border-emerald-400/45 bg-emerald-500/20 px-3.5 py-2.5 text-[12.5px] font-semibold text-emerald-100"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>{info}</span>
            </div>
          )}

          {/* MODE 1: PASSWORD LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handlePasswordLogin} className="mt-4 space-y-3.5">
              {/* Mobile Number Input */}
              <div>
                <label
                  htmlFor="login-phone"
                  className="mb-1.5 block text-[13px] font-semibold text-white/95"
                >
                  মোবাইল নাম্বার
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[#d6a94b]/80 bg-[#0b123d]/85 px-3 shadow-[0_0_16px_rgba(245,158,11,0.12)] transition-all focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-400/30 sm:h-12">
                  <BangladeshFlagIcon className="h-4 w-6 shrink-0" />
                  <span className="num shrink-0 text-[14.5px] font-semibold text-white/95">
                    +880
                  </span>
                  <span className="h-5 w-px bg-white/30" aria-hidden="true" />
                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="17XX-XXXXXX"
                    className="num min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/35"
                  />
                  <Phone className="h-[17px] w-[17px] shrink-0 text-white/55" strokeWidth={2} />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-[13px] font-semibold text-white/95"
                >
                  পাসওয়ার্ড
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-lg border border-white/25 bg-[#20295c]/60 px-3 transition-all focus-within:border-amber-300/80 focus-within:ring-2 focus-within:ring-amber-400/25 sm:h-12">
                  <Lock className="h-[17px] w-[17px] shrink-0 text-white/55" strokeWidth={2} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError('');
                    }}
                    placeholder="••••••••••"
                    className="min-w-0 flex-1 bg-transparent text-[15px] tracking-wider text-white outline-none placeholder:text-white/55"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <Eye className="h-[17px] w-[17px]" strokeWidth={2} />
                    ) : (
                      <EyeOff className="h-[17px] w-[17px]" strokeWidth={2} />
                    )}
                  </button>
                </div>

                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[11.5px] font-medium text-[#c084fc] transition-colors hover:text-amber-300 sm:text-[12px]"
                  >
                    পাসওয়ার্ড ভুলে গেছেন? / Forgot Password?
                  </button>
                </div>
              </div>

              {/* Glossy Golden Pill CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-shimmer-hover relative flex h-11 w-full items-center justify-center rounded-full border border-amber-200/50 text-[15px] font-extrabold text-[#1f1202] shadow-[0_8px_26px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.75)] transition-all hover:scale-[1.015] hover:brightness-105 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-75 sm:h-12 sm:text-[15.5px]"
                style={{
                  background:
                    'linear-gradient(180deg, #f9c846 0%, #e59819 52%, #c77807 100%)',
                }}
              >
                <span>{submitting ? 'লগইন হচ্ছে… / Signing in…' : 'লগইন করুন / LOGIN'}</span>
                {!submitting && (
                  <ChevronRight
                    className="absolute right-4 h-5 w-5 text-[#1f1202]/85"
                    strokeWidth={2.5}
                  />
                )}
              </button>

              {/* OTP Divider Link */}
              <div className="relative flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-white/20" />
                <button
                  type="button"
                  onClick={() => switchMode('otp')}
                  className="text-[12px] font-medium text-white/90 transition-colors hover:text-amber-300 sm:text-[12.5px]"
                >
                  OTP দিয়ে লগইন করুন / Login with OTP
                </button>
                <span className="h-px flex-1 bg-white/20" />
              </div>
            </form>
          )}

          {/* MODE 2: OTP LOGIN */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3.5">
              <div>
                <label
                  htmlFor="otp-phone"
                  className="mb-1.5 block text-[13px] font-semibold text-white/95"
                >
                  মোবাইল নাম্বার
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[#d6a94b]/80 bg-[#0b123d]/85 px-3 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-400/30 sm:h-12">
                  <BangladeshFlagIcon className="h-4 w-6 shrink-0" />
                  <span className="num shrink-0 text-[14.5px] font-semibold text-white/95">
                    +880
                  </span>
                  <span className="h-5 w-px bg-white/30" aria-hidden="true" />
                  <input
                    id="otp-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="17XX-XXXXXX"
                    className="num min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/35"
                  />
                  <Phone className="h-[17px] w-[17px] shrink-0 text-white/55" />
                </div>
              </div>

              {otpSent && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="otp-code"
                      className="text-[13px] font-semibold text-white/95"
                    >
                      OTP কোড লিখুন
                    </label>
                    <button
                      type="button"
                      disabled={countdown > 0}
                      onClick={handleSendOtp}
                      className="num text-[12px] font-bold text-cyan-300 disabled:text-white/40"
                    >
                      {countdown > 0 ? `${countdown}s` : 'আবার পাঠান / Resend'}
                    </button>
                  </div>
                  <div className="flex h-11 items-center gap-2.5 rounded-lg border border-white/25 bg-[#20295c]/60 px-3 focus-within:border-amber-300 sm:h-12">
                    <KeyRound className="h-[17px] w-[17px] shrink-0 text-amber-300" />
                    <input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(event) => {
                        setOtpCode(event.target.value.replace(/\D/g, ''));
                        if (error) setError('');
                      }}
                      placeholder="123456"
                      className="num min-w-0 flex-1 bg-transparent text-[16px] font-bold tracking-[0.28em] text-white outline-none placeholder:tracking-normal placeholder:text-white/35"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-shimmer-hover relative flex h-11 w-full items-center justify-center rounded-full border border-amber-200/50 text-[15px] font-extrabold text-[#1f1202] shadow-[0_8px_26px_rgba(245,158,11,0.45)] transition-all hover:scale-[1.015] active:scale-[0.985] sm:h-12"
                style={{
                  background:
                    'linear-gradient(180deg, #f9c846 0%, #e59819 52%, #c77807 100%)',
                }}
              >
                <span>
                  {!otpSent
                    ? 'OTP পাঠান / SEND OTP'
                    : submitting
                      ? 'যাচাই হচ্ছে…'
                      : 'যাচাই করে লগইন করুন / VERIFY'}
                </span>
                <ChevronRight
                  className="absolute right-4 h-5 w-5 text-[#1f1202]/85"
                  strokeWidth={2.5}
                />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[12.5px] font-semibold text-purple-200 hover:text-amber-300"
                >
                  ← পাসওয়ার্ড দিয়ে লগইন করুন / Password Login
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: REGISTER SHOP */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                  দোকানের নাম / Shop Name
                </label>
                <div className="flex h-10 items-center gap-2.5 rounded-lg border border-white/25 bg-[#0b123d]/85 px-3 focus-within:border-amber-300">
                  <Store className="h-4 w-4 shrink-0 text-amber-300" />
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="যেমন: মায়ের দোয়া মুদি স্টোর"
                    className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                    মালিকের নাম / Owner
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/25 bg-[#0b123d]/85 px-3 focus-within:border-amber-300">
                    <User className="h-4 w-4 shrink-0 text-white/55" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="আপনার নাম"
                      className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                    এলাকা / Area
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/25 bg-[#0b123d]/85 px-3 focus-within:border-amber-300">
                    <MapPin className="h-4 w-4 shrink-0 text-white/55" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none [&>option]:bg-[#141b47]"
                    >
                      {AREAS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {lang === 'bn' ? item.bn : item.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                  মোবাইল নাম্বার
                </label>
                <div className="flex h-10 items-center gap-2.5 rounded-lg border border-[#d6a94b]/80 bg-[#0b123d]/85 px-3 focus-within:border-amber-300">
                  <BangladeshFlagIcon className="h-4 w-6 shrink-0" />
                  <span className="num text-[14px] font-semibold text-white/95">+880</span>
                  <span className="h-4 w-px bg-white/30" aria-hidden="true" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="17XX-XXXXXX"
                    className="num min-w-0 flex-1 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/35"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                  পাসওয়ার্ড সেট করুন
                </label>
                <div className="flex h-10 items-center gap-2.5 rounded-lg border border-white/25 bg-[#20295c]/60 px-3 focus-within:border-amber-300">
                  <Lock className="h-4 w-4 shrink-0 text-white/55" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/45"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-white/60 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-shimmer-hover relative mt-1 flex h-11 w-full items-center justify-center rounded-full border border-amber-200/50 text-[14.5px] font-extrabold text-[#1f1202] shadow-[0_8px_26px_rgba(245,158,11,0.45)] transition-all hover:scale-[1.015] active:scale-[0.985] sm:h-12"
                style={{
                  background:
                    'linear-gradient(180deg, #f9c846 0%, #e59819 52%, #c77807 100%)',
                }}
              >
                <span>
                  {submitting ? 'রেজিস্টার হচ্ছে…' : 'রেজিস্টার করুন / REGISTER SHOP'}
                </span>
                <ChevronRight
                  className="absolute right-4 h-5 w-5 text-[#1f1202]/85"
                  strokeWidth={2.5}
                />
              </button>
            </form>
          )}

          {/* MODE 4: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-white/95">
                  নিবন্ধিত মোবাইল নাম্বার
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[#d6a94b]/80 bg-[#0b123d]/85 px-3 focus-within:border-amber-300 sm:h-12">
                  <BangladeshFlagIcon className="h-4 w-6 shrink-0" />
                  <span className="num text-[14.5px] font-semibold text-white/95">+880</span>
                  <span className="h-5 w-px bg-white/30" aria-hidden="true" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="17XX-XXXXXX"
                    className="num min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/35"
                  />
                </div>
              </div>

              {resetSent && (
                <>
                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                      রিসেট কোড (OTP)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="num h-11 w-full rounded-lg border border-white/25 bg-[#20295c]/60 px-3 text-[15px] font-bold tracking-widest text-white outline-none focus:border-amber-300"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-white/95">
                      নতুন পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-lg border border-white/25 bg-[#20295c]/60 px-3 text-[15px] text-white outline-none focus:border-amber-300"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn-shimmer-hover relative flex h-11 w-full items-center justify-center rounded-full border border-amber-200/50 text-[15px] font-extrabold text-[#1f1202] shadow-[0_8px_26px_rgba(245,158,11,0.45)] transition-all hover:scale-[1.015] active:scale-[0.985] sm:h-12"
                style={{
                  background:
                    'linear-gradient(180deg, #f9c846 0%, #e59819 52%, #c77807 100%)',
                }}
              >
                <span>
                  {resetSent ? 'পাসওয়ার্ড সেট করুন / UPDATE' : 'কোড পাঠান / SEND RESET CODE'}
                </span>
                <ChevronRight
                  className="absolute right-4 h-5 w-5 text-[#1f1202]/85"
                  strokeWidth={2.5}
                />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[12.5px] font-semibold text-purple-200 hover:text-amber-300"
                >
                  ← লগইনে ফিরে যান / Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Footer Link: Register Shop / Login */}
          <div className="mt-4 text-center text-[12px] text-white/85 sm:text-[12.5px]">
            {mode === 'register' ? (
              <>
                ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-[#38bdf8] transition-colors hover:text-amber-300"
                >
                  লগইন করুন / Partner Login
                </button>
              </>
            ) : (
              <>
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-[#38bdf8] transition-colors hover:text-amber-300"
                >
                  রেজিস্টার করুন / Register Shop
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
