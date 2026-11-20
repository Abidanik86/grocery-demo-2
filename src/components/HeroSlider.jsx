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

  const slide = SLIDES[index];

  return (
    <section id="hero" className="relative bg-canvas">

      {/* --------------------------------------------------------- slides */}
      <div
        className="relative h-[280px] overflow-hidden bg-brand-deep sm:h-[400px] lg:h-[480px]"
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
            </article>
          );
        })}

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-deep shadow-soft transition-all hover:bg-white hover:scale-105 sm:left-5 sm:h-11 sm:w-11"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-deep shadow-soft transition-all hover:bg-white hover:scale-105 sm:right-5 sm:h-11 sm:w-11"
          aria-label="Next slide"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.6} />
        </button>

        {/* Dots + progress */}
        <div className="absolute inset-x-0 bottom-3.5 z-10 flex items-center justify-center gap-2.5 sm:bottom-5">
          {SLIDES.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(slideIndex)}
              className="group relative h-2.5 overflow-hidden rounded-full bg-white/55 transition-all hover:bg-white/80"
              style={{ width: slideIndex === index ? 34 : 10 }}
              aria-label={`${copy.hero.dots} ${slideIndex + 1}`}
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
