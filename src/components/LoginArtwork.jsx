/**
 * Crisp Bangladesh flag SVG used inside the +880 mobile input prefix.
 */
export function BangladeshFlagIcon({ className = 'h-4 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={`rounded-[3px] shadow-xs ${className}`}
      aria-hidden="true"
    >
      <rect width="24" height="16" rx="2" fill="#006A4E" />
      <circle cx="10.8" cy="8" r="4.6" fill="#F42A41" />
    </svg>
  );
}
