import { imagePlugin } from '@sc-fam/shared-vite-plugins/image';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { rawMarkdownPlugin } from './vite-plugins/markdown';

export default defineConfig({
  mode: 'storybook',
  build: {
    outDir: 'build',
  },
  plugins: [tsconfigPaths(), rawMarkdownPlugin(), imagePlugin()],
});
