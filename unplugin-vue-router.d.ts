/**
 * Type declarations for unplugin-vue-router compatibility
 * Import this file in your project for full unplugin-vue-router support
 */

import type { EnhancedPushOptions } from './dist/index.js';

declare module 'vue-router' {
  interface Router {
    push(
      to: import('vue-router').RouteLocationRaw,
      options?: EnhancedPushOptions
    ): Promise<import('vue-router').NavigationFailure | void | undefined>;
  }
}

// For unplugin-vue-router compatibility
declare module 'unplugin-vue-router/dist/types' {
  interface _RouterTyped<RouteMap extends _RouteMapGeneric = _RouteMapGeneric> {
    push<Name extends keyof RouteMap = keyof RouteMap>(
      to:
        | RouteLocationAsString<RouteMap>
        | RouteLocationAsRelativeTyped<RouteMap, Name>
        | RouteLocationAsPathTyped<RouteMap, Name>,
      options?: EnhancedPushOptions
    ): ReturnType<Router['push']>;
  }
}
