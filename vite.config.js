/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { injectIWER } from '@iwsdk/vite-plugin-iwer';
import { compileUIKit } from '@iwsdk/vite-plugin-uikitml';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    // HTTPS support for WebXR development
    mkcert(), // disabled for dev server environments in Freestyle.sh

    // WebXR emulation runtime injection
    injectIWER({
      device: 'metaQuest3',
      sem: {
        defaultScene: 'living_room'
      },
      activation: 'always',
      verbose: true,
    }),

    // UIKit compilation plugin
    compileUIKit({
      sourceDir: 'ui',
      outputDir: 'public/ui',
      verbose: true, // Enable verbose logging for testing
    }),

    // Watch public folder for config changes
    {
      name: 'watch-public',
      handleHotUpdate({ file, server }) {
        if (file.includes('/public/')) {
          server.ws.send({
            type: 'full-reload',
          });
          return [];
        }
      },
    },
  ],

  // Development server configuration
  server: {
    https: true,
    host: '0.0.0.0',
    port: 8081,
    open: true,
  },

  // server: {
  //   port: 3000,
  //   allowedHosts: true,
  //   host: "0.0.0.0"
  // },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'esnext', // Support modern features including top-level await
    rollupOptions: {
      input: './index.html',
    },
  },

  // esbuild configuration for dev server
  esbuild: {
    target: 'esnext', // Support modern features including top-level await
  },

  // Optimization dependencies configuration
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    esbuildOptions: {
      target: 'esnext', // Ensure dependencies are also built with modern target
    },
  },

  // Asset handling
  publicDir: 'public',

  // Base path for assets
  base: './',
});
