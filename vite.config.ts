import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/api/frogi': {
        target: 'http://10.130.116.226:8000/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/frogi/, '')
      }
    }
  }
})
