import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// Static pages under public/ load the tracker via %VITE_TRACKER_URL%. Vite copies
// public/ as-is, so this placeholder is filled in by rewriteTrackerUrl below.
const TRACKER_PLACEHOLDER = '%VITE_TRACKER_URL%';
const PROD_TRACKER_URL = 'https://uni-education-elearning.pages.dev/tracker/uni-tracker.js';

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

// Fill in %VITE_TRACKER_URL% in public/ pages, both when serving (npm run dev)
// and in the built output (.env.develop / .env.production pick the URL).
function rewriteTrackerUrl(trackerUrl) {
  const fill = (html) => html.replaceAll(TRACKER_PLACEHOLDER, trackerUrl);
  return {
    name: 'rewrite-tracker-url',
    configureServer(server) {
      const publicDir = resolve(__dirname, 'public');
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent((req.url || '').split('?')[0]);
        if (!pathname.endsWith('.html')) return next();
        const file = join(publicDir, pathname);
        if (!file.startsWith(publicDir) || !existsSync(file)) return next();
        const html = readFileSync(file, 'utf8');
        if (!html.includes(TRACKER_PLACEHOLDER)) return next();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fill(html));
      });
    },
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      if (!existsSync(dist)) return;
      for (const file of readdirSync(dist, { recursive: true })) {
        if (!String(file).endsWith('.html')) continue;
        const path = join(dist, String(file));
        const html = readFileSync(path, 'utf8');
        if (html.includes(TRACKER_PLACEHOLDER)) writeFileSync(path, fill(html));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_');
  return {
    // Relative URLs so the built site works on GitHub Pages project sites
    // (e.g. …/S3-CH5-table/) as well as at domain root and on Vite dev server.
    base: './',
    plugins: [copyCh5DeckAssets(), rewriteTrackerUrl(env.VITE_TRACKER_URL || PROD_TRACKER_URL)],
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
  };
});
