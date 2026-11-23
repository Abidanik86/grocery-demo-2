export default function Logo({
  compact = false,
  className = '',
  subtitleClassName = '',
  textClassName = '',
  dark = false,
}) {
  if (compact) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src="/favicon.svg"
          alt="Mudiwala"
          className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 object-contain drop-shadow-xs transition-transform hover:scale-105"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Big prominent logo: increased scale with tight bounding box for maximum visibility */}
      <img
        src={dark ? '/banner-logo-dark.svg' : '/banner-logo.svg'}
        alt="Mudiwala.com"
        className="h-11 xs:h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 hover:scale-102"
        loading="eager"
      />
    </span>
  );
}
