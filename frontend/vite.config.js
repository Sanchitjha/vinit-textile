import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import fs from 'fs'

const rootDir = path.resolve(import.meta.dirname, '..')

// Custom plugin: serve /product-images and /banners from monorepo root in dev
function serveRootAssets() {
  return {
    name: 'serve-root-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const prefixes = ['/product-images', '/banners']
        const matched = prefixes.find((p) => req.url?.startsWith(p))
        if (!matched) return next()
        const filePath = path.join(rootDir, req.url)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader('Cache-Control', 'public, max-age=3600')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    serveRootAssets(),
    // Build: copy product-images & banners into dist/
    viteStaticCopy({
      targets: [
        { src: path.join(rootDir, 'product-images/**/*'), dest: 'product-images', flatten: false },
        { src: path.join(rootDir, 'banners/**/*'), dest: 'banners', flatten: false },
      ],
    }),
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
