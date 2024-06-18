import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  // root: resolve(__dirname, 'static'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
});
