import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import base44 from '@base44/vite-plugin'

export default defineConfig({
  plugins: [react(), base44()],
  server: {
    // This is the most permissive setting for Vite 6+ to allow all proxy hosts
    allowedHosts: 'all',
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