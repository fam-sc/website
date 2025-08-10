import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { cssNameGenerator } from '@sc-fam/shared-vite-plugins/css';
import { imagePlugin } from '@sc-fam/shared-vite-plugins/image';
import { multienvPlugin } from '@sc-fam/shared-vite-plugins/multienv';
import { rawMarkdownPlugin } from './vite-plugins/markdown';

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
  plugins: [
    ...(env.command === 'build' && !isLocal
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    reactRouter(),
    imagePlugin(),
    tsconfigPaths(),
    rawMarkdownPlugin(),
    multienvPlugin([
      { name: 'utils/reactDomEnv', type: 'tsx' },
    ]),
  ],
}));
