import { defineConfig } from 'vite'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        'ui-buttons': resolve(__dirname, 'src/ui-buttons.html'),
        'ui-badges': resolve(__dirname, 'src/ui-badges.html'),
        'ui-tabs': resolve(__dirname, 'src/ui-tabs.html'),
        'ui-social-buttons': resolve(__dirname, 'src/ui-social-buttons.html'),
        'ui-cards': resolve(__dirname, 'src/ui-cards.html'),
        'ui-alerts': resolve(__dirname, 'src/ui-alerts.html'),
        'ui-progressbar': resolve(__dirname, 'src/ui-progressbar.html')
      }
    },
    assetsDir: 'assets',
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    },
    devSourcemap: true
  },
  server: {
    port: process.env.VITE_PORT || 3001,
    open: true,
    host: process.env.VITE_HOST || true
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@scripts': resolve(__dirname, 'src/scripts'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  optimizeDeps: {
    include: [
      'bootstrap',
      'chart.js'
    ]
  }
})