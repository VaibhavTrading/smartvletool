import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: [
          'favicon.ico',
          'favicon.png',
          'favicon-48x48.png',
          'favicon-96x96.png',
          'favicon-144x144.png',
          'og-preview.jpg',
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'manifest.webmanifest',
          'site-config.js',
          'browser-image-compression.js',
          'smart-optimizer.js',
          'script.js',
          'editor.js',
          'site-router.js',
          'pwa-controller.js',
          'videos-config.js',
          'tutorial-videos.js',
          'style.css'
        ],
        manifest: {
          id: '/',
          name: 'SMART VLE TOOL – Online Document & ID Studio',
          short_name: 'smartvletool',
          description: 'Privacy-focused Document Scanner, Perspective Correction, ID Card Layout Studio, Image Compressor & PDF Tools with selected offline capabilities.',
          theme_color: '#4338ca',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff,woff2,json}'],
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/docs\.opencv\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'opencv-cdn-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnjs-cdn-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false,
      minify: true,
      esbuild: {
        drop: ['console', 'debugger'],
      },
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        input: {
          main: path.resolve(__dirname, 'index.html'),
          documentStudio: path.resolve(__dirname, 'document-studio/index.html'),
          idCardStudio: path.resolve(__dirname, 'id-card-studio/index.html'),
          imagePdfEditor: path.resolve(__dirname, 'image-pdf-editor/index.html'),
          about: path.resolve(__dirname, 'about/index.html'),
          aboutUs: path.resolve(__dirname, 'about-us/index.html'),
          contact: path.resolve(__dirname, 'contact/index.html'),
          contactUs: path.resolve(__dirname, 'contact-us/index.html'),
          privacyPolicy: path.resolve(__dirname, 'privacy-policy/index.html'),
          termsAndConditions: path.resolve(__dirname, 'terms-and-conditions/index.html'),
          copyrightPolicy: path.resolve(__dirname, 'copyright-policy/index.html'),
          disclaimer: path.resolve(__dirname, 'disclaimer/index.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: false,
      watch: null,
    },
  };
});
