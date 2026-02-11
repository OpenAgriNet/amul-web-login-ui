import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['login.prod.amulai.in', 'login.amulai.in'],
    proxy: {
      // Proxy all API requests to the backend server (runs on port 3001)
      // This keeps secrets server-side, similar to Vercel serverless functions
      '/api': {
        target: process.env.VITE_API_SERVER || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Alternative: Direct proxy to Amul APIs (if not using backend server)
      // Uncomment if you want to bypass the backend for Amul APIs
      // '/api/amul': {
      //   target: 'https://farmer.amulamcs.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/amul/, ''),
      //   secure: false,
      // },
    },
  },
})
