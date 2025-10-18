import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Sphynx-Flicks/', 
  server: {
    port: 3000,
    open: true,
    host: true // Allow external access
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'],
          utils: ['axios']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})