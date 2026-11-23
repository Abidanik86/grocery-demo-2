import { useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { CATEGORIES, CATEGORY_ICONS } from '../data/categories';
import { productsByCategory } from '../data/catalog';

export default function CategoryNav({
  copy,
  lang,
  activeCategory,
  onCategoryChange,
  onOpenMenu,
  onNavigate,
  className = '',
}) {
  const [open, setOpen] = useState(false);

  const pick = (id) => {
    onCategoryChange(id);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <nav className={`relative z-30 border-b border-line bg-surface ${className}`}>
      <div className="shell flex items-stretch gap-1">
        {/* Mega menu trigger */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={`flex h-12 items-center gap-2 rounded-l-xl px-3.5 text-[13px] font-bold transition-colors sm:px-4 ${
              open ? 'bg-brand text-white' : 'bg-brand-soft text-brand'
            }`}
          >
            <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.4} />
            <span className="hidden sm:inline">{copy.nav.categories}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
              strokeWidth={2.6}
            />
          </button>

          {open && (
            <div className="animate-slide-up absolute left-0 top-[calc(100%+1px)] z-50 w-[min(92vw,720px)] overflow-hidden rounded-b-2xl border border-t-0 border-line bg-surface shadow-pop">
              <div className="grid gap-1 p-2 sm:grid-cols-2">
                {CATEGORIES.filter((category) => category.id !== 'all').map(
                  (category) => {
                    const count = productsByCategory(category.id).length;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => pick(category.id)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-action-soft"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-art text-[18px] transition-transform group-hover:scale-110">
                          {CATEGORY_ICONS[category.icon]}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-bold text-ink">
                            {lang === 'bn' ? category.bn : category.en}
                          </span>
                          <span className="block truncate text-[11.5px] text-muted">
                            {lang === 'bn' ? category.blurb.bn : category.blurb.en}
                          </span>
                        </span>
                        <span className="num shrink-0 rounded-full bg-line-soft px-2 py-0.5 text-[11px] font-bold text-muted">
                          {count}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>

        {/* Inline links */}
        <ul className="no-scrollbar flex flex-1 items-center gap-0.5 overflow-x-auto">
          {CATEGORIES.map((category) => {
            const active = category.id === activeCategory;
            return (
              <li key={category.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => pick(category.id)}
                  className={`relative flex h-12 items-center gap-1.5 px-3 text-[14px] sm:text-[14.5px] font-bold transition-colors ${
                    active ? 'text-brand font-black' : 'text-ink/80 hover:text-brand'
                  }`}
                >
                  <span className="hidden lg:inline">{CATEGORY_ICONS[category.icon]}</span>
                  {lang === 'bn' ? category.bn : category.en}
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-action" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onOpenMenu}
          className="hidden h-12 shrink-0 items-center rounded-r-xl bg-brand-soft px-4 text-[13px] font-bold text-brand transition-colors hover:bg-action-soft lg:flex"
        >
          {copy.nav.offers}
        </button>
      </div>
    </nav>
  );
}
