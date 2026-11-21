import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query from React.
 *
 * Used to switch between the desktop single-page layout and the mobile
 * tabbed layout, so both never mount at the same time.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on phone-sized viewports, where the mobile tab bar takes over. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)');
}
