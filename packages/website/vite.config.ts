import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { manifestPlugin } from './vite-plugins/manifest';

export default defineConfig((env) => ({
  build: {
    outDir: 'build',
  },
  esbuild: {
    target: 'es2022',
  },
  plugins: [
    ...(env.command === 'build'
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    reactRouter(),
    manifestPlugin(),
    tsconfigPaths(),
  ],
}));
