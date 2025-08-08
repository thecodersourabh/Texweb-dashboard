import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative paths for mobile, absolute for web
  base: process.env.VITE_WEB_BUILD === 'true' ? '/Texweb-dashboard/' : './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ionic: ['@ionic/react'],
          auth: ['@auth0/auth0-react'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
        assetFileNames: (assetInfo) => {
          const imgExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
          const fileName = assetInfo.name || '';
          if (imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
            return 'assets/images/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    target: ['es2020', 'chrome100', 'safari13'],
    minify: 'terser',
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});
