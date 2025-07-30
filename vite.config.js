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
        'ui-progressbar': resolve(__dirname, 'src/ui-progressbar.html'),
        'ui-grids': resolve(__dirname, 'src/ui-grids.html'),
        'ui-modals': resolve(__dirname, 'src/ui-modals.html'),
        'ui-switches': resolve(__dirname, 'src/ui-switches.html'),
        'ui-typography': resolve(__dirname, 'src/ui-typography.html'),
        'tables-basic': resolve(__dirname, 'src/tables-basic.html'),
        'tables-data': resolve(__dirname, 'src/tables-data.html'),
        'forms-advanced': resolve(__dirname, 'src/forms-advanced.html'),
        'forms-basic': resolve(__dirname, 'src/forms-basic.html'),
        'widgets': resolve(__dirname, 'src/widgets.html'),
        'charts-chartjs': resolve(__dirname, 'src/charts-chartjs.html'),
        'charts-flot': resolve(__dirname, 'src/charts-flot.html'),
        'charts-peity': resolve(__dirname, 'src/charts-peity.html'),
        'maps-gmap': resolve(__dirname, 'src/maps-gmap.html'),
        'maps-vector': resolve(__dirname, 'src/maps-vector.html'),
        'font-fontawesome': resolve(__dirname, 'src/font-fontawesome.html'),
        'font-themify': resolve(__dirname, 'src/font-themify.html'),
        'page-login': resolve(__dirname, 'src/page-login.html'),
        'page-register': resolve(__dirname, 'src/page-register.html'),
        'pages-forget': resolve(__dirname, 'src/pages-forget.html'),
        'frame': resolve(__dirname, 'src/frame.html')
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