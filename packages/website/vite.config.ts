import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { manifestPlugin } from './vite-plugins/manifest';
import { imagePlugin } from './vite-plugins/image';
import { multienvPlugin } from './vite-plugins/multienv';

const isLocal = process.env.LOCAL === '1';

export default defineConfig((env) => ({
  build: {
    outDir: 'build',
    minify: 'esbuild',
  },
  ssr: {
    noExternal: true,
  },
  esbuild: {
    target: 'es2022',
  },
  plugins: [
    ...(env.command === 'build' && !isLocal
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    reactRouter(),
    manifestPlugin(),
    imagePlugin(),
    multienvPlugin(),
    tsconfigPaths(),
  ],
}));
