'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import PageLoadingScreen from './PageLoadingScreen';

export default function RouteLoadingHandler() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('Loading...');
  const currentPathRef = React.useRef(pathname);

  // Coordinate dismissals across routes
  React.useEffect(() => {
    currentPathRef.current = pathname;

    if (pathname === '/ask-ai') {
      // For /ask-ai, keep the single loading screen visible while the 3D scene & workstation
      // load in the background. It will dismiss cleanly when 'trigger-route-ready' is fired,
      // or at the 3.0s safety ceiling.
      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(safetyTimer);
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  // Initial mount check (e.g. user refreshes directly on /ask-ai)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/ask-ai') {
      setMessage('Initializing 3D Neural Workstation & Spatial Models...');
      setIsLoading(true);
    }
  }, []);

  // Intercept navigation clicks across the document
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked element or its ancestor is an anchor or has data-route-href
      const anchor = target.closest('a');
      const routeHolder = target.closest('[data-route-href]');
      const href = anchor?.getAttribute('href') || routeHolder?.getAttribute('data-route-href');
      const targetAttr = anchor?.getAttribute('target');

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
        if (url.origin === window.location.origin && url.pathname !== currentPathRef.current) {
          // Determine contextual message
          let loadingMsg = 'Loading portfolio...';
          if (url.pathname.startsWith('/projects/') && url.pathname !== '/projects') {
            loadingMsg = 'Loading case study...';
          } else if (url.pathname === '/projects' || url.pathname.startsWith('/projects')) {
            loadingMsg = 'Loading engineering directory...';
          } else if (url.pathname === '/ask-ai' || url.pathname.startsWith('/ask-ai')) {
            loadingMsg = 'Initializing 3D AI workstation & spatial models...';
          } else if (url.pathname === '/experience') {
            loadingMsg = 'Loading career history...';
          } else if (url.pathname === '/work') {
            loadingMsg = 'Loading engineering systems...';
          }

          setMessage(loadingMsg);
          // Display loading screen ASAP (0ms)
          setIsLoading(true);
        }
      } catch {
        // invalid URL, ignore
      }
    };

    // Listen for programmatic redirects (e.g. project cards, buttons, etc.)
    const handleCustomRouteLoading = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string; message?: string }>;
      const targetPath = customEvent.detail?.path;
      if (!targetPath) return;

      // If already on that path, don't trigger
      if (targetPath === currentPathRef.current) return;

      let loadingMsg = customEvent.detail?.message;
      if (!loadingMsg) {
        if (targetPath.startsWith('/projects/') && targetPath !== '/projects') {
          loadingMsg = 'Loading case study...';
        } else if (targetPath === '/projects' || targetPath.startsWith('/projects')) {
          loadingMsg = 'Loading engineering directory...';
        } else if (targetPath === '/ask-ai' || targetPath.startsWith('/ask-ai')) {
          loadingMsg = 'Initializing 3D AI workstation & spatial models...';
        } else if (targetPath === '/experience') {
          loadingMsg = 'Loading career history...';
        } else if (targetPath === '/work') {
          loadingMsg = 'Loading engineering systems...';
        } else {
          loadingMsg = 'Loading portfolio...';
        }
      }

      setMessage(loadingMsg);
      // Display loading screen ASAP (0ms)
      setIsLoading(true);
    };

    // Listen for completion signal from destination page (e.g. /ask-ai)
    const handleRouteReady = () => {
      setIsLoading(false);
    };

    // Listen for message updates while loading
    const handleUpdateMessage = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setMessage(customEvent.detail.message);
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('trigger-route-loading', handleCustomRouteLoading);
    window.addEventListener('trigger-route-ready', handleRouteReady);
    window.addEventListener('update-route-loading-message', handleUpdateMessage);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('trigger-route-loading', handleCustomRouteLoading);
      window.removeEventListener('trigger-route-ready', handleRouteReady);
      window.removeEventListener('update-route-loading-message', handleUpdateMessage);
    };
  }, []);

  return <PageLoadingScreen isVisible={isLoading} message={message} minDuration={300} />;
}
