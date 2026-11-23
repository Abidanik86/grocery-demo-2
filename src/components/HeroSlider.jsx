import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SLIDES } from '../data/catalog';

const DURATION = 6000;

export default function HeroSlider({ copy, lang, onShop }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const total = SLIDES.length;

  const go = useCallback(
    (next) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, paused, go]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <section id="hero" className="relative bg-canvas">
      {/* --------------------------------------------------------- slides */}
      <div
        className="relative h-[clamp(320px,88vw,420px)] overflow-hidden bg-brand-deep sm:h-[clamp(380px,52vw,460px)] lg:h-[clamp(440px,42vw,540px)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((item, slideIndex) => {
          const active = slideIndex === index;
          return (
            <article
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${active ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              aria-hidden={!active}
            >
              <HeroImage slide={item} active={active} eager={slideIndex === 0} />
              {active && <SlideContent slide={item} copy={copy} lang={lang} onShop={onShop} />}
            </article>
          );
        })}

        {/* Desktop Side Arrows (hidden on mobile to prevent any text overlapping) */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-deep shadow-lift backdrop-blur transition-all hover:bg-white hover:scale-105 sm:grid"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.8} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-deep shadow-lift backdrop-blur transition-all hover:bg-white hover:scale-105 sm:grid"
          aria-label="Next slide"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
        </button>

        {/* Slide Indicators: Clean, modern pills without any overlap or distortion */}
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2 sm:bottom-4 sm:gap-2.5">
          {SLIDES.map((item, slideIndex) => {
            const active = slideIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(slideIndex)}
                className="flex h-6 items-center justify-center p-1 transition-all focus:outline-none"
                aria-label={`${copy.hero.dots} ${slideIndex + 1}`}
                aria-current={active}
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 ${active
                      ? 'w-7 sm:w-8 bg-[#f07b1a] shadow-sm ring-1 ring-white/40'
                      : 'w-2.5 bg-white/60 hover:bg-white/90 hover:scale-110'
                    }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Slide copy overlay with increased font sizes and generous padding.
 */
function SlideContent({ slide, copy, lang, onShop }) {
  return (
    <div className="absolute inset-0 z-[5] flex items-end bg-gradient-to-t from-brand-deep/95 via-brand-deep/50 to-transparent">
      <div className="shell w-full pb-10 sm:pb-14">
        {/* Eyebrow badge */}
        {/* <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1 text-[11.5px] sm:text-[13px] font-black uppercase tracking-wider text-white shadow-soft">
            ⚡ {lang === 'bn' ? slide.eyebrow.bn : slide.eyebrow.en}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[12px] font-extrabold text-white">
            🌱 ১০০% ভেজালমুক্ত
          </span>
        </div> */}

        {/* Main headline with increased font size */}
        <h2 className="mt-2.5 max-w-[20ch] text-[22px] xs:text-[25px] sm:text-[34px] lg:text-[44px] font-black leading-[1.22] text-white drop-shadow-md">
          {lang === 'bn' ? slide.title.bn : slide.title.en}
        </h2>

        {/* Subtext */}
        <p className="mt-2 hidden max-w-[52ch] text-[14.5px] sm:text-[16px] leading-relaxed text-white/90 sm:block drop-shadow">
          {lang === 'bn' ? slide.text.bn : slide.text.en}
        </p>

        {/* CTA Button with larger text and comfortable touch height */}
        <button
          type="button"
          onClick={onShop}
          className="mt-3.5 inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-gradient-to-r from-action via-mango to-action-dark px-6 text-[14px] sm:text-[15.5px] font-black text-white shadow-lift transition-all hover:scale-105 active:scale-95 sm:mt-4 sm:min-h-[50px] sm:px-8"
        >
          <span>{lang === 'bn' ? slide.cta.bn : slide.cta.en}</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
        </button>
      </div>
    </div>
  );
}

function HeroImage({ slide, active, eager }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="absolute inset-0 bg-gradient-to-br from-brand via-[#1a6b4c] to-brand-deep"
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={slide.image}
      alt=""
      className={`absolute inset-0 h-full w-full object-cover ${active ? 'animate-kenburns' : ''}`}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
