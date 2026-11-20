/**
 * Brand glyphs for the footer. Lucide v1 dropped brand icons, so these are
 * simple inline SVG paths.
 */

export function FacebookIcon({ className = 'h-[17px] w-[17px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.9c0-.8.2-1.2 1.3-1.2h1.4V3.2c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v1H8v2.7h2.2V21H13V11.2h2.3l.4-2.7h-2.7Z" />
    </svg>
  );
}

export function InstagramIcon({ className = 'h-[17px] w-[17px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className = 'h-[17px] w-[17px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.7 3h3l-6.6 7.6L22 21h-5.9l-4.3-5.6L6.7 21h-3l7-8L3 3h6l3.9 5.2L17.7 3Zm-1 16.2h1.7L8.4 4.7H6.6l10.1 14.5Z" />
    </svg>
  );
}

export function YoutubeIcon({ className = 'h-[17px] w-[17px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}
