import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects', // Path to the _redirects file in your project root
          dest: ''           // Place it in the root of the output directory (dist)
        }
      ]
    })
  ],
  resolve: {
    alias: {
      buffer: 'buffer/',            // Polyfill for buffer
      stream: 'stream-browserify',  // Polyfill for stream
      util: 'util',                 // Polyfill for util
      // Add other modules as needed
    },
  },
  define: {
    global: 'window', // Sets global variable to window for browser compatibility
  },
  build: {
    rollupOptions: {
      external: ['util'], // Exclude util if it is not directly needed
    },
  },
});
