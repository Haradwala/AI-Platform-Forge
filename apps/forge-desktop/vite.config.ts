import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Monaco Editor workers must be treated as assets
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['monaco-editor'],
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  // Prevent Vite from exposing Node.js modules to the renderer
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
});
