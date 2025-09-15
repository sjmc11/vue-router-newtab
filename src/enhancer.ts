import type { NavigationFailure, RouteLocationRaw, Router } from 'vue-router';
import type {
  DebugLogger,
  EnhancedPushOptions,
  KeyboardState,
  NewTabRouterConfig,
} from './types';
import {
  createDebugLogger,
  isBrowser,
  isSSR,
  openInNewTab,
  resolveRouteUrl,
} from './utils';

/**
 * Keyboard monitoring class for detecting modifier key presses
 */
class KeyboardMonitor {
  private state: KeyboardState = {
    isModifierPressed: false,
  };

  private listeners: (() => void)[] = [];
  private debug: DebugLogger;

  constructor(debug: DebugLogger) {
    this.debug = debug;
    this.setupEventListeners();
  }

  /**
   * Set up global keyboard event listeners
   */
  private setupEventListeners(): void {
    if (!isBrowser()) {
      this.debug('Keyboard monitoring disabled in SSR environment');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        this.state.isModifierPressed = true;
        this.debug('Modifier key pressed', {
          metaKey: event.metaKey,
          ctrlKey: event.ctrlKey,
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        this.state.isModifierPressed = false;
        this.debug('Modifier key released');
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('keyup', handleKeyUp, { passive: true });

    // Store cleanup functions
    this.listeners.push(() => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    });

    // Handle window blur to reset state
    const handleBlur = () => {
      this.state.isModifierPressed = false;
      this.debug('Window blurred, resetting modifier state');
    };

    window.addEventListener('blur', handleBlur);
    this.listeners.push(() => {
      window.removeEventListener('blur', handleBlur);
    });
  }

  /**
   * Check if a modifier key is currently pressed
   */
  public isModifierKeyPressed(): boolean {
    return this.state.isModifierPressed;
  }

  /**
   * Get current keyboard state
   */
  public getState(): KeyboardState {
    return { ...this.state };
  }

  /**
   * Clean up all event listeners
   */
  public destroy(): void {
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];
    this.debug('Keyboard monitor destroyed');
  }
}

/**
 * New tab router class that adds Cmd/Ctrl+click functionality
 */
class NewTabRouterClass {
  private router: Router;
  private originalPush: Router['push'];
  private keyboardMonitor: KeyboardMonitor;
  private config: Required<NewTabRouterConfig>;
  private debug: DebugLogger;

  constructor(router: Router, config: NewTabRouterConfig = {}) {
    this.router = router;
    this.config = {
      enableCtrlClick: true,
      debugMode: false,
      ...config,
    };

    this.debug = createDebugLogger(this.config.debugMode);
    this.keyboardMonitor = new KeyboardMonitor(this.debug);

    // Store original push method
    this.originalPush = router.push.bind(router);

    // Override the push method
    this.setupNewTabRouter();

    this.debug('New tab router initialized', this.config);
  }

  /**
   * Setup the router with new tab functionality
   */
  private setupNewTabRouter(): void {
    this.router.push = (
      to: RouteLocationRaw,
      options?: EnhancedPushOptions
    ): Promise<NavigationFailure | void | undefined> => {
      return this.newTabPush(to, options);
    };
  }

  /**
   * New tab push method with modifier key detection
   */
  private async newTabPush(
    to: RouteLocationRaw,
    options: EnhancedPushOptions = {}
  ): Promise<NavigationFailure | void | undefined> {
    this.debug('New tab push called', { to, options });

    // Check for force new tab option
    if (options.forceNewTab) {
      this.debug('Force new tab requested');
      return this.handleNewTabNavigation(to, options);
    }

    // Check for newTab option
    if (options.newTab !== undefined) {
      if (options.newTab && this.keyboardMonitor.isModifierKeyPressed()) {
        this.debug('NewTab option with modifier key detected');
        return this.handleNewTabNavigation(to, options);
      } else if (options.newTab === false) {
        this.debug(
          'NewTab explicitly disabled, skipping modifier key behavior'
        );
        return this.originalPush(to);
      }
    }

    // Check if modifier key is pressed and enhancement is enabled (default behavior)
    if (
      this.config.enableCtrlClick &&
      this.keyboardMonitor.isModifierKeyPressed()
    ) {
      this.debug('Modifier key detected, opening in new tab');
      return this.handleNewTabNavigation(to, options);
    }

    // Normal navigation
    this.debug('Performing normal navigation');
    return this.originalPush(to);
  }

  /**
   * Handle new tab navigation
   */
  private async handleNewTabNavigation(
    to: RouteLocationRaw,
    _options: EnhancedPushOptions
  ): Promise<NavigationFailure | void | undefined> {
    try {
      const resolved = resolveRouteUrl(this.router, to);

      if (resolved.isExternal) {
        this.debug('External URL detected, opening directly', {
          url: resolved.href,
        });
        openInNewTab(resolved.href);
      } else {
        this.debug('Internal route, resolving and opening in new tab', {
          route: to,
          resolved: resolved.href,
        });
        openInNewTab(resolved.href);
      }

      return Promise.resolve();
    } catch (error) {
      this.debug(
        'Error in new tab navigation, falling back to normal navigation',
        error
      );
      return this.originalPush(to);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): NewTabRouterConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<NewTabRouterConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.debug = createDebugLogger(this.config.debugMode);
    this.debug('Configuration updated', this.config);
  }

  /**
   * Clean up the new tab router
   */
  public destroy(): void {
    this.keyboardMonitor.destroy();

    // Restore original push method
    this.router.push = this.originalPush;

    this.debug('New tab router destroyed');
  }
}

/**
 * Add new tab functionality to a router instance with Cmd/Ctrl+click support
 */
export function newTabRouter(
  router: Router,
  config?: NewTabRouterConfig
): Router {
  if (isSSR()) {
    // eslint-disable-next-line no-console
    console.warn('[VueRouterNewTab] Enhancement skipped in SSR environment');
    return router;
  }

  const newTabRouterInstance = new NewTabRouterClass(router, config);

  // Store new tab router reference for potential cleanup
  (router as unknown as Record<string, unknown>).__newTabRouter =
    newTabRouterInstance;

  return router;
}

/**
 * Get the new tab router instance from a router
 */
export function getNewTabRouter(router: Router): NewTabRouterClass | null {
  return (
    ((router as unknown as Record<string, unknown>)
      .__newTabRouter as NewTabRouterClass) || null
  );
}

/**
 * Destroy the new tab router for a router
 */
export function destroyNewTabRouter(router: Router): void {
  const newTabRouterInstance = getNewTabRouter(router);
  if (newTabRouterInstance) {
    newTabRouterInstance.destroy();
    delete (router as unknown as Record<string, unknown>).__newTabRouter;
  }
}
