import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import base44 from '@base44/vite-plugin'

export default defineConfig({
  plugins: [react(), base44()],
  server: {
    allowedHosts: ["all", "ta-01km6wkfmynsn3zztvadxgb106-5173-jezurb22a97sginal8qilv8y5.w.modal.host", ".modal.host"],
    host: true, ta-01km6wkfmynsn3zztvadxgb106-5173-jezurb22a97sginal8qilv8y5.w.modal.host
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})