/**
 * Vue Router New Tab Enhancer
 *
 * A Vue 3 + Vue Router 4 enhancement package that adds intelligent navigation behavior,
 * specifically Cmd/Ctrl+click functionality to programmatic router.push() calls.
 *
 * @package vue-router-newtab
 * @version 1.0.0
 */

// Main exports
export { destroyNewTabRouter, getNewTabRouter, newTabRouter } from './enhancer';

// Type exports
export type {
  DebugLogger,
  EnhancedPushOptions,
  NewTabRouter,
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

/**
 * Package metadata
 */
export const PACKAGE_INFO = {
  name: 'vue-router-newtab',
  version: VERSION,
  description:
    'Enhanced Vue Router with Cmd/Ctrl+click support for new tab navigation',
  author: 'sjmc11',
  license: 'MIT',
} as const;
