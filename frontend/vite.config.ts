import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path para GitHub Pages
const base = process.env.NODE_ENV === 'production' ? '/Me-tricas-DS/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});

