import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function copyCh5DeckAssets() {
  return {
    name: 'copy-ch5-deck-assets',
    closeBundle() {
      const src = resolve(__dirname, 'slides/ch5-condensation-hydrolysis/public');
      if (!existsSync(src)) return;
      const dest = resolve(__dirname, 'dist/slides/ch5-condensation-hydrolysis/public');
      mkdirSync(resolve(dest, '..'), { recursive: true });
      cpSync(src, dest, { recursive: true });
    },
  };
}

export default defineConfig({
  // Relative URLs so the built site works on GitHub Pages project sites
  // (e.g. …/S3-CH5-table/) as well as at domain root and on Vite dev server.
  base: './',
  plugins: [copyCh5DeckAssets()],
  server: {
    port: 5183,
    strictPort: true,
    proxy: {
      // Proxy all /api/chem requests to the chemistry API server
      '/api/chem': {
        target: 'http://10.0.0.149:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chem/, ''),
      },
    },
  },
});
