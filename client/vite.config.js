import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/visualize-data-visualisation-dashboard",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://visualize-data-visualisation-dashboard.onrender.com',
        changeOrigin: true,
        // secure: false,
      },
    },
  },
})
