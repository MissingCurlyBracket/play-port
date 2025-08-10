import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tanstackRouter from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  base: '/play-port/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
