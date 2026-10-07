import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// Tracker URL hard-coded in the static pages under public/ (Vite copies those
// as-is, so %VITE_TRACKER_URL% can't be used there).
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

// Point every built page at the tracker for this build mode (.env.develop / .env.production).
function rewriteTrackerUrl(trackerUrl) {
  return {
    name: 'rewrite-tracker-url',
    apply: 'build',
    closeBundle() {
      if (!trackerUrl || trackerUrl === PROD_TRACKER_URL) return;
      const dist = resolve(__dirname, 'dist');
      for (const file of readdirSync(dist, { recursive: true })) {
        if (!String(file).endsWith('.html')) continue;
        const path = join(dist, String(file));
        const html = readFileSync(path, 'utf8');
        if (html.includes(PROD_TRACKER_URL)) {
          writeFileSync(path, html.replaceAll(PROD_TRACKER_URL, trackerUrl));
        }
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
    plugins: [copyCh5DeckAssets(), rewriteTrackerUrl(env.VITE_TRACKER_URL)],
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
