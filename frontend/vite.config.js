import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // usually './' is fine in frontend folder
  build: {
    outDir: 'dist',
  },
});
  