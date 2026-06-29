import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 1. On réactive le plugin React (indispensable pour le JSX !)
  plugins: [
    react({
      jsxRuntime: 'automatic', // Assure l'injection automatique de React
    })
  ],
  // 2. On garde ta configuration de serveur et de proxy pour Laravel
  server: {
    port: 5173,
    open: true, // Ouvre automatiquement le navigateur au démarrage
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // URL de ton Laragon / Laravel
        changeOrigin: true,
        secure: false,
      }
    }
  }
})