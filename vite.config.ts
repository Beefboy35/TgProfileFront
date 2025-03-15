import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['f813-185-193-51-54.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'https://f813-185-193-51-54.ngrok-free.app',  // Проксируем бекенд запущенный в ngrok
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 5174
  },
});