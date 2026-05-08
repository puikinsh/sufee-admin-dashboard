import { defineConfig } from 'vite';
import { resolve, basename } from 'path';
import { globSync } from 'fs';
import legacy from '@vitejs/plugin-legacy';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import handlebars from 'vite-plugin-handlebars';

// Auto-discover every HTML page directly under src/. Adding a new page is
// drop-in: create the .html file, no config change required.
// `index.html` is mapped to the `main` chunk for backwards compatibility.
const htmlEntries = Object.fromEntries(
  globSync('src/*.html').map(file => {
    const name = basename(file, '.html');
    return [name === 'index' ? 'main' : name, resolve(__dirname, file)];
  })
);

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './', // Use relative paths for assets
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries
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
    // Build-time Handlebars partials.
    // Templates live in src/components/*.html and are inlined via {{> name ...}}
    // — see src/components/stat-card.html for an example.
    // (The runtime fetch-based system in src/partials/ is separate; it handles
    // sidebar/header/head injection at runtime.)
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components')
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'partials',
          dest: ''
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['bootstrap', 'chart.js']
  }
});
