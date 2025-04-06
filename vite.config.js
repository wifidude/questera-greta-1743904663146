import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
      jsxRuntime: 'automatic'
    })
  ],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'pdf-vendor': ['@react-pdf/renderer'],
          'ui-vendor': ['framer-motion', 'react-icons']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@react-pdf/renderer', 'react', 'react-dom', 'framer-motion']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'jsx'
  }
});