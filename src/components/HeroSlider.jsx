import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Leaf, ShieldCheck, Star } from 'lucide-react';
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
        className="relative h-[clamp(230px,58vw,300px)] overflow-hidden bg-brand-deep sm:h-[clamp(320px,46vw,420px)] lg:h-[clamp(420px,42vw,520px)]"
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
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
                active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!active}
            >
              <HeroImage slide={item} active={active} eager={slideIndex === 0} />
              {active && <SlideContent slide={item} copy={copy} lang={lang} onShop={onShop} />}
            </article>
          );
        })}

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-deep shadow-soft transition-all hover:bg-white hover:scale-105 sm:left-5 sm:h-11 sm:w-11"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.6} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-deep shadow-soft transition-all hover:bg-white hover:scale-105 sm:right-5 sm:h-11 sm:w-11"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.6} />
        </button>

        {/* Dots + progress */}
        <div className="absolute inset-x-0 bottom-1 z-10 flex items-center justify-center gap-1 sm:bottom-5 sm:gap-2.5">
          {SLIDES.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(slideIndex)}
              className="group relative flex h-8 w-6 items-center justify-center sm:h-6 sm:w-auto"
              aria-label={`${copy.hero.dots} ${slideIndex + 1}`}
              aria-current={slideIndex === index}
            >
              <span
                className="block h-2.5 overflow-hidden rounded-full bg-white/55 transition-all group-hover:bg-white/80"
                style={{ width: slideIndex === index ? 34 : 10 }}
              >
                {slideIndex === index && (
                  <span
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-action"
                    style={{
                      animation: `mw-progress ${DURATION}ms linear forwards`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mw-progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
}

/**
 * Slide copy overlay. It sits on a scrim so the text stays readable over any
 * photograph, and it collapses to a single clamped block on phones.
 */
function SlideContent({ slide, copy, lang, onShop }) {
  return (
    <div className="absolute inset-0 z-[5] flex items-end bg-gradient-to-t from-brand-deep/90 via-brand-deep/45 to-transparent">
      <div className="shell w-full pb-9 sm:pb-11">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ffd489] sm:text-[11.5px]">
          {lang === 'bn' ? slide.eyebrow.bn : slide.eyebrow.en}
        </p>

        <h2 className="mt-1 max-w-[18ch] text-[19px] font-extrabold leading-[1.2] text-white sm:mt-1.5 sm:max-w-[22ch] sm:text-[30px] lg:max-w-[24ch] lg:text-[38px]">
          {lang === 'bn' ? slide.title.bn : slide.title.en}
        </h2>

        <p className="mt-1.5 hidden max-w-[52ch] text-[13.5px] leading-relaxed text-white/80 sm:block">
          {lang === 'bn' ? slide.text.bn : slide.text.en}
        </p>

        <button
          type="button"
          onClick={onShop}
          className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-action px-4 text-[12.5px] font-extrabold text-white shadow-lift transition-colors hover:bg-action-dark sm:mt-4 sm:min-h-[46px] sm:px-6 sm:text-[14px]"
        >
          {lang === 'bn' ? slide.cta.bn : slide.cta.en}
          <ArrowRight className="h-4 w-4" strokeWidth={2.7} />
        </button>
      </div>
    </div>
  );
}

/**
 * Slide photo with a graceful fallback — if the file is ever missing the hero
 * keeps its layout and shows a brand gradient instead of a broken image.
 */
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
