import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

const PROD_MAIN_APP_URL = 'https://uni-education-elearning.pages.dev';
const DEFAULT_ENV = {
  VITE_MAIN_APP_URL: PROD_MAIN_APP_URL,
  VITE_TRACKER_URL: `${PROD_MAIN_APP_URL}/tracker/uni-tracker.js`,
};

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

function fillEnvPlaceholders(env) {
  const PLACEHOLDER = /%(VITE_[A-Z0-9_]+)%/g;
  const hasPlaceholder = (html) => /%VITE_[A-Z0-9_]+%/.test(html);
  const fill = (html) => html.replace(PLACEHOLDER, (match, key) => env[key] ?? match);
  return {
    name: 'fill-env-placeholders',
    configureServer(server) {
      const publicDir = resolve(__dirname, 'public');
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent((req.url || '').split('?')[0]);
        if (!pathname.endsWith('.html')) return next();
        const file = join(publicDir, pathname);
        if (!file.startsWith(publicDir) || !existsSync(file)) return next();
        const html = readFileSync(file, 'utf8');
        if (!hasPlaceholder(html)) return next();
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
        if (hasPlaceholder(html)) writeFileSync(path, fill(html));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...DEFAULT_ENV, ...loadEnv(mode, __dirname, 'VITE_') };
  return {
    // Relative URLs so the built site works on GitHub Pages project sites
    // (e.g. …/S3-CH5-table/) as well as at domain root and on Vite dev server.
    base: './',
    plugins: [copyCh5DeckAssets(), fillEnvPlaceholders(env)],
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
