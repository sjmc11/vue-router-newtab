import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import {
  createDebugLogger,
  isBrowser,
  isModifierKeyPressed,
  isSSR,
  openInNewTab,
  resolveRouteUrl,
} from '../../src/utils';

describe('Utils', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    vi.clearAllMocks();

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        {
          path: '/about',
          name: 'about',
          component: { template: '<div>About</div>' },
        },
        {
          path: '/user/:id',
          name: 'user',
          component: { template: '<div>User</div>' },
        },
      ],
    });
  });

  describe('Environment Detection', () => {
    it('should detect browser environment', () => {
      expect(isBrowser()).toBe(true);
    });

    it('should detect SSR environment', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      });

      expect(isSSR()).toBe(true);

      // Restore
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        writable: true,
      });
    });
  });

  describe('Debug Logger', () => {
    it('should create debug logger', () => {
      const logger = createDebugLogger(true);
      expect(typeof logger).toBe('function');
    });

    it('should log when debug mode is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logger = createDebugLogger(true);

      logger('test message', 'arg1', 'arg2');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[VueRouterNewTab] test message',
        'arg1',
        'arg2'
      );

      consoleSpy.mockRestore();
    });

    it('should not log when debug mode is disabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logger = createDebugLogger(false);

      logger('test message');

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Route URL Resolution', () => {
    it('should resolve string routes', () => {
      const result = resolveRouteUrl(router, '/about');
      expect(result.href).toContain('/about');
      expect(result.isExternal).toBe(false);
    });

    it('should resolve named routes', () => {
      const result = resolveRouteUrl(router, { name: 'about' });
      expect(result.href).toContain('/about');
      expect(result.isExternal).toBe(false);
    });

    it('should resolve routes with params', () => {
      const result = resolveRouteUrl(router, {
        name: 'user',
        params: { id: '123' },
      });
      expect(result.href).toContain('/user/123');
      expect(result.isExternal).toBe(false);
    });

    it('should detect external URLs', () => {
      // Mock the router.resolve to return external URL
      const mockResolve = vi
        .fn()
        .mockReturnValue({ href: 'https://example.com' });
      router.resolve = mockResolve;

      const result = resolveRouteUrl(router, 'https://example.com');
      expect(result.href).toBe('https://example.com');
      expect(result.isExternal).toBe(true);
    });

    it('should handle invalid routes gracefully', () => {
      const result = resolveRouteUrl(router, { name: 'nonexistent' });
      expect(result.href).toBe('#');
      expect(result.isExternal).toBe(false);
    });
  });

  describe('New Tab Opening', () => {
    it('should open URL in new tab', () => {
      const mockOpen = vi.fn().mockReturnValue({} as Window);
      global.window.open = mockOpen;

      const result = openInNewTab('https://example.com');

      expect(mockOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
      expect(result).toBeDefined();
    });

    it('should handle window.open errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockOpen = vi.fn().mockImplementation(() => {
        throw new Error('Blocked popup');
      });
      global.window.open = mockOpen;

      const result = openInNewTab('https://example.com');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[VueRouterNewTab] Failed to open new tab:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should return null in SSR environment', () => {
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      });

      const result = openInNewTab('https://example.com');
      expect(result).toBeNull();

      // Restore
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        writable: true,
      });
    });
  });

  describe('Modifier Key Detection', () => {
    it('should detect Cmd key on macOS', () => {
      const event = new KeyboardEvent('keydown', { metaKey: true });
      expect(isModifierKeyPressed(event)).toBe(true);
    });

    it('should detect Ctrl key on Windows/Linux', () => {
      const event = new KeyboardEvent('keydown', { ctrlKey: true });
      expect(isModifierKeyPressed(event)).toBe(true);
    });

    it('should return false when no modifier key', () => {
      const event = new KeyboardEvent('keydown', {});
      expect(isModifierKeyPressed(event)).toBe(false);
    });
  });
});
