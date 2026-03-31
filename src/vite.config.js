import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import base44 from '@base44/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), base44()],
  cacheDir: '.vite_cache_fresh',
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
    hmr: {
      // Ensuring HMR uses the correct protocol over the proxy
      clientPort: 443,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})