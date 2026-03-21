import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import base44 from '@base44/vite-plugin'

export default defineConfig({
  plugins: [react(), base44()],
  server: {
    // Explicitly listing the host often resolves issues where 'all' is ignored or restricted
    allowedHosts: [
      'ta-01km8m82rf1cfh9a9djp2p3brj-5173-o16y6ocqrhl8nl49muicsmkcw.w.modal.host'
    ],
    host: true,
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})