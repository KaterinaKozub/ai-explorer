import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Проксі прибирає залежність від CORS і блокувальників у браузері:
// запит до /freeserp/api.php Vite пересилає на https://freeserp.ai/api.php
const proxy = {
  '/freeserp': {
    target: 'https://freeserp.ai',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/freeserp/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
