import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://banking-website-t0to.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
