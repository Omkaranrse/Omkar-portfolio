'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import PageLoadingScreen from './PageLoadingScreen';

export default function RouteLoadingHandler() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('Loading...');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Clear loader as soon as pathname updates to the new page
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
  }, [pathname]);

  // Intercept navigation clicks across the document
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      // Ignore external links, new tabs, hash jumps, download links, or mailto
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.endsWith('.pdf') ||
        targetAttr === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal relative URL navigating to a DIFFERENT pathname
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          // Determine contextual message
          let loadingMsg = 'Loading portfolio...';
          if (url.pathname.startsWith('/projects/')) {
            loadingMsg = 'Loading case study...';
          } else if (url.pathname === '/ask-ai') {
            loadingMsg = 'Entering 3D AI workstation...';
          } else if (url.pathname === '/work') {
            loadingMsg = 'Loading engineering systems...';
          } else if (url.pathname === '/experience') {
            loadingMsg = 'Loading career history...';
          }

          setMessage(loadingMsg);

          // Only show loader if the transition takes time (> 140ms)
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsLoading(true);
          }, 140);
        }
      } catch {
        // invalid URL, ignore
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <PageLoadingScreen isVisible={isLoading} message={message} minDuration={350} />;
}
