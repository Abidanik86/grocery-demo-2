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
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 object-contain drop-shadow-xs transition-transform hover:scale-105"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Big Logo: banner-logo.svg on light background, banner-logo-dark.svg on dark footer */}
      <img
        src={dark ? '/banner-logo.svg' : '/banner-logo.svg'}
        alt="Mudiwala.com"
        className="h-8.5 xs:h-9.5 sm:h-11 lg:h-12 w-auto object-contain transition-transform duration-200 hover:scale-102"
        loading="eager"
      />
    </span>
  );
}
