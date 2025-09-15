/**
 * Vue Router New Tab Enhancer
 *
 * A Vue 3 + Vue Router 4 enhancement package that adds intelligent navigation behavior,
 * specifically Cmd/Ctrl+click functionality to programmatic router.push() calls.
 *
 * @package vue-router-newtab
 * @version 1.0.0
 */

// Module augmentation to extend Vue Router's Router interface
declare module 'vue-router' {
  interface Router {
    /** Enhanced push method with additional options 1 */
    push(
      to: import('vue-router').RouteLocationRaw,
      options?: {
        /** Force opening in new tab regardless of modifier key state */
        forceNewTab?: boolean;
        /** Open in new tab only if modifier key is pressed (false prevents new tab behavior) */
        newTab?: boolean;
      }
    ): Promise<import('vue-router').NavigationFailure | void | undefined>;
  }
}

// Global fallback for any router implementation
declare global {
  interface Router {
    /** Enhanced push method with additional options */
    push(
      to: import('vue-router').RouteLocationRaw,
      options?: {
        /** Force opening in new tab regardless of modifier key state */
        forceNewTab?: boolean;
        /** Open in new tab only if modifier key is pressed (false prevents new tab behavior) */
        newTab?: boolean;
      }
    ): Promise<import('vue-router').NavigationFailure | void | undefined>;
  }
}

// Main exports
export { destroyNewTabRouter, getNewTabRouter, newTabRouter } from './enhancer';

// Type exports
export type {
  DebugLogger,
  EnhancedPushOptions,
  NewTabRouterConfig,
  ResolvedUrl,
} from './types';

// Utility exports
export {
  createDebugLogger,
  isBrowser,
  isModifierKeyPressed,
  isSSR,
  openInNewTab,
  resolveRouteUrl,
} from './utils';

/**
 * Version information
 */
export const VERSION = '1.0.0';
