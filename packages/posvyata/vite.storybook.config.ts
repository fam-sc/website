import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { rawMarkdownPlugin } from './vite-plugins/markdown';

export default defineConfig({
  mode: 'storybook',
  build: {
    outDir: 'build',
  },
  plugins: [tsconfigPaths(), rawMarkdownPlugin()],
});
