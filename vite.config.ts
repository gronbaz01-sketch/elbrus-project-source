import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'autolinker/dist/Autolinker': 'autolinker',
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
});
