import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';
import { cssNameGenerator } from '@sc-fam/shared-vite-plugins/css';
import { imagePlugin } from '@sc-fam/shared-vite-plugins/image';
import { multienvPlugin } from '@sc-fam/shared-vite-plugins/multienv';
import { rawMarkdownPlugin } from './vite-plugins/markdown';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  build: {
    outDir: 'build',
    minify: 'esbuild',
  },
  css: {
    modules: {
      generateScopedName: cssNameGenerator(),
    },
    postcss: {
      plugins: [
          autoprefixer
      ],
    }
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' }, persistState: true, experimental: { remoteBindings: true } }),
    reactRouter(),
    imagePlugin(),
    tsconfigPaths(),
    rawMarkdownPlugin(),
    multienvPlugin([
      { name: 'utils/reactDomEnv', type: 'tsx' },
    ], 'cf'),
  ],
});
