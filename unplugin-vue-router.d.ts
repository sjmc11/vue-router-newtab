/**
 * Type declarations for unplugin-vue-router compatibility
 * Import this file in your project for full unplugin-vue-router support
 *
 * Note: The main vue-router module augmentation is handled in the main package.
 * This file provides additional compatibility for unplugin-vue-router's typed routing.
 */

// Import required types
import type { RouteLocationRaw, Router } from 'vue-router';

// Define the enhanced push options interface
interface EnhancedPushOptions {
  /** Force opening in new tab regardless of modifier key state */
  forceNewTab?: boolean;
  /** Open in new tab only if modifier key is pressed (false prevents new tab behavior) */
  newTab?: boolean;
}

// For unplugin-vue-router compatibility
declare module 'unplugin-vue-router/dist/types' {
  interface _RouterTyped<RouteMap = any> {
    push<Name extends keyof RouteMap = keyof RouteMap>(
      to: RouteLocationRaw,
      options?: EnhancedPushOptions
    ): ReturnType<Router['push']>;
  }
}
