import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { __MORU_BUILD__: JSON.stringify(Date.now().toString(36)) },
  // Audio generation writes thousands of assets; restart dev after adding files.
  server: { watch: { ignored: ['**/public/audio/**', '**/public/data/**', '**/work/**'] } }
});
