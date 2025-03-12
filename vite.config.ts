import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['7340-185-193-51-54.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:8005',  // Ваш бэкенд
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 5174
  },
});