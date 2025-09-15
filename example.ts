/**
 * New Tab Router Usage Example
 *
 * This file demonstrates how to use the vue-router-newtab package
 * in a Vue 3 + Vue Router 4 application.
 */

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { newTabRouter } from 'vue-router-newtab';

// If using unplugin-vue-router, import the type declarations:
// import 'vue-router-newtab/unplugin-vue-router.d.ts';
//
// This ensures TypeScript recognizes the enhanced router.push() method
// with additional options when using unplugin-vue-router's typed routing.

// Define your routes with inline dummy components
const routes = [
  {
    path: '/',
    name: 'home',
    component: {
      template: '<div><h1>Home Page</h1><p>Welcome to the home page!</p></div>',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: {
      template: '<div><h1>About Page</h1><p>This is the about page.</p></div>',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: {
      template:
        '<div><h1>Contact Page</h1><p>Contact us at example@email.com</p></div>',
    },
  },
  {
    path: '/admin/:section',
    name: 'admin',
    component: {
      template:
        '<div><h1>Admin Page</h1><p>Admin section: {{ $route.params.section }}</p></div>',
    },
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add new tab functionality to the router with Cmd/Ctrl+click support
newTabRouter(router, {
  enableCtrlClick: true,
  debugMode: process.env.NODE_ENV === 'development',
});

// Create and mount the app
const app = createApp({
  // Your app component
});

app.use(router);
app.mount('#app');

// Example component usage
export default {
  name: 'NavigationExample',
  methods: {
    // Basic navigation - works with Cmd/Ctrl+click
    goToAbout() {
      this.$router.push('/about');
    },

    // Force new tab
    openAboutInNewTab() {
      this.$router.push('/about', { forceNewTab: true });
    },

    // Conditional new tab (only if modifier key is pressed)
    openAboutConditionally() {
      this.$router.push('/about', { newTab: true });
    },

    // Prevent new tab behavior for this specific call
    normalNavigation() {
      this.$router.push('/about', { newTab: false });
    },

    // Navigate to admin
    goToAdmin() {
      this.$router.push({ name: 'admin', params: { section: 'users' } });
    },

    // External link
    openExternal() {
      this.$router.push('https://vuejs.org');
    },
  },
};
