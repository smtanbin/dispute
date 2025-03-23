import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the target server
      '/api': {
        target: 'http://10.140.6.12',
        changeOrigin: true,
        secure: false
      },
      // Add specific proxy for PocketBase auth endpoints
      '/api/': {
        target: 'http://10.140.6.12',
        changeOrigin: true,
        secure: false
      },
      '/frogi/': {
        target: 'http://10.140.6.12',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
