import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@data': resolve(__dirname, 'src/data'),
      '@content': resolve(__dirname, 'content'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
