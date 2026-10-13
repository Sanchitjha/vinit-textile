import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Product photos are now optimised WebPs living in public/product-images/, so
// Vite serves and bundles them like any other static asset — no root-folder
// copy plugin needed. The raw originals stay in the repo-root product-images/
// staging area (gitignored) and are converted with optimize-images.cjs.

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
