import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Product photos are now optimised WebPs living in public/product-images/, so
// Vite serves and bundles them like any other static asset — no root-folder
// copy plugin needed. The raw originals stay in the repo-root product-images/
// staging area (gitignored) and are converted with optimize-images.cjs.

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
        '/__clerk': {
          target: 'https://frontend-api.clerk.dev',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__clerk/, ''),
          headers: {
            'Clerk-Proxy-Url': 'https://vinit-textiles.vercel.app/__clerk',
            ...(env.CLERK_SECRET_KEY ? { 'Clerk-Secret-Key': env.CLERK_SECRET_KEY } : {}),
          },
        },
      },
    },
  }
})
