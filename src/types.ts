import type { NavigationFailure, RouteLocationRaw, Router } from 'vue-router';

/**
 * Configuration options for the new tab router
 */
export interface NewTabRouterConfig {
  /** Enable Cmd/Ctrl+click detection for new tab navigation (default: true) */
  enableCtrlClick?: boolean;
  /** Enable debug logging (default: false) */
  debugMode?: boolean;
}

/**
 * Enhanced options for router.push calls
 */
export interface EnhancedPushOptions {
  /** Force opening in new tab regardless of modifier key state */
  forceNewTab?: boolean;
  /** Open in new tab only if modifier key is pressed (false prevents new tab behavior) */
  newTab?: boolean;
}

/**
 * Internal state for keyboard monitoring
 */
export interface KeyboardState {
  isModifierPressed: boolean;
}

/**
 * New tab router interface with additional methods
 */
export interface NewTabRouter extends Router {
  /** Enhanced push method with additional options */
  push(
    to: RouteLocationRaw,
    options?: EnhancedPushOptions
  ): Promise<NavigationFailure | void | undefined>;
}

/**
 * URL resolution result
 */
export interface ResolvedUrl {
  href: string;
  route: RouteLocationRaw;
  isExternal: boolean;
}

/**
 * Debug logger function type
 */
export type DebugLogger = (message: string, ...args: unknown[]) => void;
