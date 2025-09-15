import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { destroyNewTabRouter, newTabRouter } from '../../src/enhancer';
import type { NewTabRouterConfig } from '../../src/types';

describe('NewTabRouter', () => {
  let router: ReturnType<typeof createRouter>;
  let mockRoutes: any[];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create test routes
    mockRoutes = [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      {
        path: '/about',
        name: 'about',
        component: { template: '<div>About</div>' },
      },
      {
        path: '/contact',
        name: 'contact',
        component: { template: '<div>Contact</div>' },
      },
    ];

    // Create router with mocked history
    router = createRouter({
      history: createWebHistory(),
      routes: mockRoutes,
    });
  });

  afterEach(() => {
    // Clean up new tab router
    destroyNewTabRouter(router);
  });

  describe('Basic Setup', () => {
    it('should setup new tab router without errors', () => {
      expect(() => newTabRouter(router)).not.toThrow();
    });

    it('should add new tab push method', () => {
      const newTabRouterInstance = newTabRouter(router);
      expect(typeof newTabRouterInstance.push).toBe('function');
    });

    it('should preserve original router functionality', () => {
      const newTabRouterInstance = newTabRouter(router);
      expect(newTabRouterInstance.currentRoute).toBeDefined();
      expect(newTabRouterInstance.options).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should accept configuration options', () => {
      const config: NewTabRouterConfig = {
        enableCtrlClick: false,
        debugMode: true,
      };

      expect(() => newTabRouter(router, config)).not.toThrow();
    });

    it('should use default configuration when none provided', () => {
      const newTabRouterInstance = newTabRouter(router);
      expect(newTabRouterInstance).toBeDefined();
    });
  });

  describe('Normal Navigation', () => {
    it('should perform normal navigation when no modifier key', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const originalPush = vi.spyOn(router, 'push');

      await newTabRouterInstance.push('/about');

      expect(originalPush).toHaveBeenCalledWith('/about');
    });

    it('should perform normal navigation without callbacks', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const originalPush = vi.spyOn(router, 'push');
      await newTabRouterInstance.push('/about');
      expect(originalPush).toHaveBeenCalledWith('/about');
    });
  });

  describe('Force New Tab', () => {
    it('should open in new tab when forceNewTab is true', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const mockWindowOpen = vi.mocked(global.window.open);

      await newTabRouterInstance.push('/about', { forceNewTab: true });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/about'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should open new tab without callbacks', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const mockWindowOpen = vi.mocked(global.window.open);
      await newTabRouterInstance.push('/about', { forceNewTab: true });
      expect(mockWindowOpen).toHaveBeenCalled();
    });
  });

  describe('NewTab Option', () => {
    it('should open new tab when newTab is true and modifier key is pressed', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const mockWindowOpen = vi.mocked(global.window.open);

      // Simulate modifier key pressed
      vi.spyOn(
        newTabRouterInstance.__newTabRouter.keyboardMonitor,
        'isModifierKeyPressed'
      ).mockReturnValue(true);

      await newTabRouterInstance.push('/about', { newTab: true });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/about'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should perform normal navigation when newTab is true but no modifier key', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const originalPush = vi.spyOn(router, 'push');
      const mockWindowOpen = vi.mocked(global.window.open);

      // Simulate no modifier key pressed
      vi.spyOn(
        newTabRouterInstance.__newTabRouter.keyboardMonitor,
        'isModifierKeyPressed'
      ).mockReturnValue(false);

      await newTabRouterInstance.push('/about', { newTab: true });

      expect(mockWindowOpen).not.toHaveBeenCalled();
      expect(originalPush).toHaveBeenCalledWith('/about', { newTab: true });
    });

    it('should perform normal navigation when newTab is false (prevents modifier key behavior)', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const originalPush = vi.spyOn(router, 'push');
      const mockWindowOpen = vi.mocked(global.window.open);

      // Simulate modifier key pressed
      vi.spyOn(
        newTabRouterInstance.__newTabRouter.keyboardMonitor,
        'isModifierKeyPressed'
      ).mockReturnValue(true);

      await newTabRouterInstance.push('/about', { newTab: false });

      expect(mockWindowOpen).not.toHaveBeenCalled();
      expect(originalPush).toHaveBeenCalledWith('/about', { newTab: false });
    });

    it('should use default behavior when newTab option is not provided', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const mockWindowOpen = vi.mocked(global.window.open);

      // Simulate modifier key pressed
      vi.spyOn(
        newTabRouterInstance.__newTabRouter.keyboardMonitor,
        'isModifierKeyPressed'
      ).mockReturnValue(true);

      await newTabRouterInstance.push('/about');

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/about'),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid routes gracefully', async () => {
      const newTabRouterInstance = newTabRouter(router);
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Mock window.open to throw error
      global.window.open = vi.fn(() => {
        throw new Error('Blocked popup');
      });

      await newTabRouterInstance.push('/invalid-route', { forceNewTab: true });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to open new tab'),
        expect.any(Error)
      );

      consoleWarn.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const newTabRouterInstance = newTabRouter(router);

      destroyNewTabRouter(router);

      expect(global.document.removeEventListener).toHaveBeenCalled();
      expect(global.window.removeEventListener).toHaveBeenCalled();
    });
  });
});
