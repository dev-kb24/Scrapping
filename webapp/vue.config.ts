import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // Racine publique (laisser '/' si le site est à la racine du domaine)
  base: '/Scrapping',

  server: {
    host: 0.0.0.0,        // écoute 0.0.0.0 -> accessible depuis l’extérieur
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',   // port de ton backend
        changeOrigin: true,                // change l’en-tête Host
        rewrite: path => path.replace(/^\/api/, '') // supprime /api
      }
    }
  },

  build: {
    outDir: 'dist',   // dossier de sortie
    sourcemap: false  // désactive les sourcemaps en prod
  }
})

