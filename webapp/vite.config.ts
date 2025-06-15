import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',     // écoute toutes les interfaces
    port: 4173,

    // ✅ 3 options possibles ↓↓↓

    // A) Liste précise des hosts autorisés
    allowedHosts: ['internal.altoriaweb.com', 'localhost'],

    /* B) Autoriser tout (déconseillé en prod) :
    allowedHosts: 'all',
    */

    /* C) Joker *.altoriaweb.com + localhost :
    allowedHosts: ['.altoriaweb.com', 'localhost'],
    */
    proxy: {
      '/api': {
        target: 'http://localhost:4173',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '')
      }
    }
  },

  build: { outDir: 'dist' }
})
