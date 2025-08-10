import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tanstackRouter from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

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
    tailwindcss(),
    react(),
  ],
  base: '/play-port/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'main',
      },
    },
  },
});
