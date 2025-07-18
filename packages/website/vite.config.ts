import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { manifestPlugin } from './vite-plugins/manifest';
import { imagePlugin } from './vite-plugins/image';
import { multienvPlugin } from './vite-plugins/multienv';
import { templatePlugin } from './vite-plugins/template';
import { cssNameGenerator } from './vite-plugins/css';
import { markdownPlugin } from './vite-plugins/markdown';

const isLocal = process.env.LOCAL === '1';

export default defineConfig((env) => ({
  build: {
    outDir: 'build',
    minify: 'esbuild',
  },
  css: {
    modules: {
      generateScopedName: cssNameGenerator(),
    },
  },
  ssr:
    env.command === 'build' && isLocal
      ? {
          noExternal: true,
          external: ['sharp'],
        }
      : undefined,
  esbuild: {
    target: 'es2022',
  },
  plugins: [
    ...(env.command === 'build' && !isLocal
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    markdownPlugin('./src/markdown/config.tsx'),
    reactRouter(),
    manifestPlugin(),
    imagePlugin(),
    multienvPlugin(),
    templatePlugin(),
    tsconfigPaths(),
  ],
}));
