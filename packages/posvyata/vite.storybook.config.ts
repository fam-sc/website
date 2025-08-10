import { defineConfig } from 'vite';
import { rawMarkdownPlugin } from 'vite-plugins/markdown';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  mode: 'storybook',
  build: {
    outDir: 'build',
  },
  plugins: [tsconfigPaths(), rawMarkdownPlugin()],
});
