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
        className="relative h-[clamp(210px,58vw,270px)] sm:h-[clamp(300px,44vw,390px)] lg:h-[clamp(380px,34vw,470px)] overflow-hidden bg-brand-deep"
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
        <div className="absolute inset-x-0 bottom-2.5 sm:bottom-4 z-10 flex items-center justify-center gap-1.5 sm:gap-2.5">
          {SLIDES.map((item, slideIndex) => {
            const active = slideIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(slideIndex)}
                className="flex h-5 sm:h-6 items-center justify-center p-1 transition-all focus:outline-none"
                aria-label={`${copy.hero.dots} ${slideIndex + 1}`}
                aria-current={active}
              >
                <span
                  className={`block h-2 sm:h-2.5 rounded-full transition-all duration-300 ${active
                    ? 'w-6 sm:w-8 bg-[#f07b1a] shadow-sm ring-1 ring-white/40'
                    : 'w-2 sm:w-2.5 bg-white/60 hover:bg-white/90 hover:scale-110'
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
 * Slide copy overlay with horizontal gradient to preserve right-side image context.
 */
function SlideContent({ slide, copy, lang, onShop }) {
  return (
    <div className="absolute inset-0 z-[5] flex items-center sm:items-end bg-gradient-to-r from-brand-deep/95 via-brand-deep/85 sm:via-brand-deep/60 to-transparent">
      <div className="shell w-full pb-6 sm:pb-12 pt-1 sm:pt-0">
        {/* Eyebrow badge */}

        {/* Main headline - balanced proportions on mobile */}
        <h2 className="mt-1.5 sm:mt-2.5 max-w-[17ch] sm:max-w-[22ch] text-[20px] xs:text-[23px] sm:text-[36px] lg:text-[46px] font-black leading-[1.2] text-white drop-shadow-md">
          {lang === 'bn' ? slide.title.bn : slide.title.en}
        </h2>

        {/* Subtext */}
        <p className="mt-2 hidden max-w-[52ch] text-[15px] sm:text-[17px] leading-relaxed text-white/95 sm:block drop-shadow font-medium">
          {lang === 'bn' ? slide.text.bn : slide.text.en}
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onShop}
          className="mt-2.5 sm:mt-4 inline-flex min-h-[38px] sm:min-h-[48px] items-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-action via-mango to-action-dark px-5 sm:px-7 text-[13.5px] sm:text-[16px] font-black text-white shadow-lift transition-all hover:scale-105 active:scale-95"
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
      className={`absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-center ${active ? 'sm:animate-kenburns' : ''
        }`}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
