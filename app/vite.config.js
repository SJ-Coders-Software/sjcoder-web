import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: {
    // Output lands directly at the repo root so a plain `git checkout`
    // (which is all some cPanel deployments reliably do) already serves
    // the right files — no post-checkout task required.
    outDir: '../',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        careers: fileURLToPath(new URL('./careers.html', import.meta.url)),
        aiScribe: fileURLToPath(new URL('./ai-scribe.html', import.meta.url)),
        aapliPuja: fileURLToPath(new URL('./aaplipuja.html', import.meta.url)),
      },
    },
  },
});
