import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  server: {
        proxy: {
            "/api": {
                target: "https://gesti-nalquilerautosnodejs-production.up.railway.app",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    }
});
