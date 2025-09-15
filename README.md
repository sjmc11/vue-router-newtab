# New Tab Router

[![npm version](https://img.shields.io/npm/v/vue-router-newtab.svg)](https://www.npmjs.com/package/vue-router-newtab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A Vue 3 + Vue Router 4 package that adds intelligent navigation behavior, specifically **Cmd/Ctrl+click functionality** to programmatic `router.push()` calls.

## ✨ Features

- 🎯 **Smart Navigation**: Automatically detects Cmd/Ctrl key presses during `router.push()` calls
- 🆕 **New Tab Support**: Opens routes in new tabs when modifier keys are pressed
- 🔧 **Highly Configurable**: Custom behaviors, callbacks, and route patterns
- 📱 **Cross-Platform**: Works on macOS (Cmd), Windows/Linux (Ctrl)
- 🛡️ **Type Safe**: Full TypeScript support with comprehensive type definitions
- 🚀 **Zero Breaking Changes**: Non-intrusive addition of new tab functionality to existing router
- 📦 **Tree Shakeable**: Optimized bundle size with ESM support
- 🧪 **Well Tested**: Comprehensive test coverage with Vitest and Playwright

## 🚀 Quick Start

### Installation

```bash
npm install vue-router-newtab
# or
yarn add vue-router-newtab
# or
pnpm add vue-router-newtab
```

### Basic Usage

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { newTabRouter } from 'vue-router-newtab';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
  ],
});

// Enhance the router with Cmd/Ctrl+click support
newTabRouter(router);

// Now your existing router.push() calls work intelligently!
// Cmd/Ctrl + router.push('/about') = opens in new tab
// Normal router.push('/about') = normal navigation
```

### In Your Components

```vue
<template>
  <div>
    <button @click="navigateToAbout">About (Cmd/Ctrl+click for new tab)</button>
    <button @click="forceNewTab">Force New Tab</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToAbout = () => {
  // This will open in new tab if Cmd/Ctrl is pressed
  router.push('/about');
};

const forceNewTab = () => {
  // This will always open in new tab
  router.push('/about', { forceNewTab: true });
};

const conditionalNewTab = () => {
  // This will only open in new tab if Cmd/Ctrl is pressed
  router.push('/about', { newTab: true });
};
</script>
```

## 📖 API Reference

### `newTabRouter(router, config?)`

Adds new tab functionality to a Vue Router instance with intelligent navigation behavior.

**Parameters:**

- `router: Router` - The Vue Router instance to support newTab behaviour
- `config?: NewTabRouterConfig` - Optional configuration object

**Returns:** `NewTabRouter` - The router instance with new tab functionality

### Configuration Options

```typescript
interface NewTabRouterConfig {
  /** Enable Cmd/Ctrl+click detection (default: true) */
  enableCtrlClick?: boolean;

  /** Enable debug logging (default: false) */
  debugMode?: boolean;
}
```

### Enhanced Push Options

```typescript
interface EnhancedPushOptions {
  /** Force opening in new tab regardless of modifier key */
  forceNewTab?: boolean;

  /** Open in new tab only if modifier key is pressed (false prevents new tab behavior) */
  newTab?: boolean;
}
```

## 🎛️ Advanced Usage

### Debug Mode

```typescript
newTabRouter(router, {
  debugMode: process.env.NODE_ENV === 'development',
});
```

### Per-Call Customization

```typescript
// Force new tab for specific calls
router.push('/external-link', { forceNewTab: true });

// Conditional new tab (only if modifier key is pressed)
router.push('/optional-new-tab', { newTab: true });

// Prevent new tab behavior for specific calls
router.push('/normal-navigation', { newTab: false });
```

## 🔧 TypeScript Support

The package provides comprehensive TypeScript support with full type definitions:

```typescript
import type {
  NewTabRouterConfig,
  EnhancedPushOptions,
  NewTabRouter,
} from 'vue-router-newtab';

// Your router is now fully typed
const router: NewTabRouter = newTabRouter(
  createRouter({
    /* ... */
  })
);

// newTab push method with full type safety
router.push('/about', { forceNewTab: true });
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Coverage

```bash
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
```

## 🌍 Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 📦 Bundle Size

- **ESM**: ~3.2KB gzipped
- **CJS**: ~3.5KB gzipped

## 🚨 Important Notes

### SSR Compatibility

The new tab router automatically detects server-side environments and skips new tab functionality to prevent SSR errors:

```typescript
// Safe to use in SSR - will be skipped automatically
newTabRouter(router);
```

### Memory Management

The new tab router automatically cleans up event listeners when the router is destroyed. For manual cleanup:

```typescript
import { destroyNewTabRouter } from 'vue-router-newtab';

// Clean up when needed
destroyNewTabRouter(router);
```

### Security Considerations

- New tabs are opened with `noopener,noreferrer` for security
- External URLs are detected and handled appropriately
- Popup blockers are handled gracefully with fallback to normal navigation

## 🔄 Migration Guide

### From Existing Projects

The new tab router is designed to be non-intrusive. Your existing code will work without changes:

```typescript
// Before
router.push('/about');

// After (same code, enhanced behavior)
newTabRouter(router);
router.push('/about'); // Now supports Cmd/Ctrl+click!
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/sjmc11/vue-router-newtab.git

# Install dependencies
npm install

# Run tests
npm run test

# Build the package
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) team for the amazing framework
- [Vue Router](https://router.vuejs.org/) team for the excellent routing solution
- All contributors who help make this project better

## 📞 Support

- 📖 [Documentation](https://github.com/sjmc11/vue-router-newtab#readme)
- 🐛 [Issue Tracker](https://github.com/sjmc11/vue-router-newtab/issues)
- 💬 [Discussions](https://github.com/sjmc11/vue-router-newtab/discussions)

---

Made with ❤️ for the Vue.js community
