// Custom event dispatcher & listeners for app-wide power tools

export const APP_EVENTS = {
  TOGGLE_COMMAND_PALETTE: 'app:toggle-command-palette',
  TOGGLE_TELEMETRY_HUD: 'app:toggle-telemetry-hud',
  OPEN_MOBILE_EMULATOR: 'app:open-mobile-emulator',
  OPEN_TRACE_INSPECTOR: 'app:open-trace-inspector',
} as const;

export function emitAppEvent(event: keyof typeof APP_EVENTS, detail?: unknown) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(APP_EVENTS[event], { detail }));
}

export function onAppEvent(
  event: keyof typeof APP_EVENTS,
  handler: (detail: any) => void
) {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const customEvent = e as CustomEvent;
    handler(customEvent.detail);
  };
  window.addEventListener(APP_EVENTS[event], listener);
  return () => window.removeEventListener(APP_EVENTS[event], listener);
}
