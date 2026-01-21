import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PashuGPT token for local dev only - in production this is in env vars
const PASHUGPT_TOKEN = 'REDACTED_PASHUGPT_TOKEN'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/amul': {
        target: 'https://farmer.amulamcs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/amul/, ''),
        secure: false,
      },
      '/api/pashugpt/farmer': {
        target: 'https://api.amulpashudhan.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          return `/configman/v1/PashuGPT/GetFarmerDetailsByMobile${url.search}`
        },
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer ${PASHUGPT_TOKEN}`)
          })
        },
      },
      '/api/pashugpt/animal': {
        target: 'https://api.amulpashudhan.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          return `/configman/v1/PashuGPT/GetAnimalDetailsByTagNo${url.search}`
        },
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer ${PASHUGPT_TOKEN}`)
          })
        },
      },
    },
  },
})
