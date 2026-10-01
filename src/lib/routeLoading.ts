'use client';

/**
 * Dispatches an immediate route loading event to display the full-screen loader ASAP
 * before and while the target page loads in the background.
 */
export function triggerRouteLoading(path: string, customMessage?: string) {
  if (typeof window === 'undefined') return;

  let message = customMessage;
  if (!message) {
    if (path.startsWith('/projects/') && path !== '/projects') {
      message = 'Loading case study...';
    } else if (path === '/projects' || path.startsWith('/projects')) {
      message = 'Loading engineering directory...';
    } else if (path === '/ask-ai' || path.startsWith('/ask-ai')) {
      message = 'Initializing 3D AI workstation & spatial models...';
    } else if (path === '/experience' || path.startsWith('/experience')) {
      message = 'Loading career history...';
    } else if (path === '/work' || path.startsWith('/work')) {
      message = 'Loading engineering systems...';
    } else {
      message = 'Loading portfolio...';
    }
  }

  window.dispatchEvent(
    new CustomEvent('trigger-route-loading', {
      detail: { path, message },
    })
  );
}

/**
 * Signals that the destination page has finished background loading & preparation
 * so the persistent loading screen can dismiss cleanly.
 */
export function triggerRouteReady() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('trigger-route-ready'));
}

/**
 * Updates the message displayed on the active route loading screen.
 */
export function updateRouteLoadingMessage(message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('update-route-loading-message', {
      detail: { message },
    })
  );
}

