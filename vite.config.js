import { defineConfig } from 'vite';

// Frontend-only: site source lives in public/
export default defineConfig({
  root: 'public',
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
