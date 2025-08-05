import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative paths for mobile, absolute for web
  base: process.env.NODE_ENV === 'production' && !process.env.VITE_WEB_BUILD ? './' : '/Texweb-dashboard/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ionic: ['@ionic/react'],
          auth: ['@auth0/auth0-react'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});
