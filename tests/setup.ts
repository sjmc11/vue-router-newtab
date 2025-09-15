import { vi } from 'vitest';

// Mock DOM environment
const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  querySelector: vi.fn(() => null),
  createElement: vi.fn(() => ({
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
  })),
};

const mockWindow = {
  open: vi.fn(() => ({})),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  location: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  history: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
};

// Mock global objects
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock Vue Router's createWebHistory
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    createWebHistory: () => ({
      base: '/',
      location: mockWindow.location,
      state: {},
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      createHref: vi.fn(to => {
        if (typeof to === 'string') {
          return to.startsWith('http') ? to : `/${to.replace(/^\//, '')}`;
        }
        if (to.name) {
          const routes = {
            home: '/',
            about: '/about',
            contact: '/contact',
            user: '/user/:id',
          };
          let path = routes[to.name as keyof typeof routes] || '/';
          if (to.params && to.name === 'user') {
            path = path.replace(':id', to.params.id as string);
          }
          return path;
        }
        return to.path || '/';
      }),
      listen: vi.fn(() => vi.fn()),
      resolve: vi.fn(to => {
        let href = '/';
        if (typeof to === 'string') {
          href = to.startsWith('http') ? to : `/${to.replace(/^\//, '')}`;
        } else if (to.name) {
          const routes = {
            home: '/',
            about: '/about',
            contact: '/contact',
            user: '/user/:id',
          };
          let path = routes[to.name as keyof typeof routes] || '/';
          if (to.params && to.name === 'user') {
            path = path.replace(':id', to.params.id as string);
          }
          href = path;
        } else if (to.path) {
          href = to.path;
        }
        return { href, route: to };
      }),
    }),
  };
});
