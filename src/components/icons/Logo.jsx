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
          className="brand-logo-compact drop-shadow-xs"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Big prominent logo: controlled directly from CSS (.brand-logo in src/index.css) */}
      <img
        src={dark ? '/banner-logo-dark.svg' : '/banner-logo.svg'}
        alt="Mudiwala.com"
        className="brand-logo drop-shadow-xs"
        loading="eager"
      />
    </span>
  );
}
