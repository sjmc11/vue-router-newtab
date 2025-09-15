import type { RouteLocationRaw, Router } from 'vue-router';
import type { DebugLogger, ResolvedUrl } from './types';

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if we're in a server-side environment
 */
export function isSSR(): boolean {
  return !isBrowser();
}

/**
 * Create a debug logger function
 */
export function createDebugLogger(debugMode: boolean): DebugLogger {
  return (message: string, ...args: unknown[]) => {
    if (debugMode && isBrowser()) {
      // eslint-disable-next-line no-console
      console.log(`[VueRouterNewTab] ${message}`, ...args);
    }
  };
}

/**
 * Resolve a route to a full URL for new tab navigation
 */
export function resolveRouteUrl(
  router: Router,
  to: RouteLocationRaw
): ResolvedUrl {
  try {
    const resolved = router.resolve(to);
    const href = resolved.href;

    // Check if it's an external URL
    const isExternal =
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//');

    return {
      href,
      route: to,
      isExternal,
    };
  } catch {
    // Fallback for invalid routes
    const href = typeof to === 'string' ? to : '#';
    return {
      href,
      route: to,
      isExternal: false,
    };
  }
}

/**
 * Open a URL in a new tab
 */
export function openInNewTab(
  url: string,
  target: string = '_blank'
): Window | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.open(url, target, 'noopener,noreferrer');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[VueRouterNewTab] Failed to open new tab:', error);
    return null;
  }
}

/**
 * Check if a modifier key is currently pressed
 */
export function isModifierKeyPressed(event: KeyboardEvent): boolean {
  // Check for Cmd key (macOS) or Ctrl key (Windows/Linux)
  return event.metaKey || event.ctrlKey;
}
