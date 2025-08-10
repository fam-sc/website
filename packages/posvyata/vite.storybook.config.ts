import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  mode: 'storybook',
  build: {
    outDir: 'build',
    target: 'es2022',
  },
  plugins: [tsconfigPaths()],
});
