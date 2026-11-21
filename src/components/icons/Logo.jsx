export default function Logo({
  compact = false,
  className = '',
  subtitleClassName = '',
  textClassName = '',
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand via-[#1a6b4c] to-brand-deep shadow-soft">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path
            d="M14 22h36l-3.5 22a4 4 0 0 1-4 3.4H21.5a4 4 0 0 1-4-3.4L14 22Z"
            fill="#f6f1e6"
          />
          <path
            d="M24 22a8 8 0 0 1 16 0"
            fill="none"
            stroke="#f6f1e6"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="26" cy="31" r="3.4" fill="#e0a83c" />
          <circle cx="35" cy="34" r="4.4" fill="#c0453f" />
          <path
            d="M41 28c2.6 0 4.6 2 4.6 4.6S43.6 37 41 37s-4.6-2-4.6-4.6S38.4 28 41 28Z"
            fill="#7aa648"
          />
        </svg>
      </span>
      {!compact && (
        <span className={`flex flex-col leading-none ${textClassName}`}>
          <span className="text-[19px] font-extrabold tracking-tight text-brand-deep">
            Mudiwala
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            <span className={`inline-flex items-center gap-1 ${subtitleClassName}`}>
              <span lang="bn">মুদিওয়ালা</span>
              <span aria-hidden="true">·</span>
              <span>Grocery</span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
