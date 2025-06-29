import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv, PluginOption } from 'vite';

const env = loadEnv('', './packages/website', '');

const plugins = [react(), tsconfigPaths()] as PluginOption[];

export default defineConfig({
  plugins,
  test: {
    pool: 'threads',
    coverage: {
      exclude: ['**/storybook-static'],
    },
    projects: [
      {
        plugins,
        env,
        test: {
          include: ['**/*.test.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.btest.ts'],
          name: 'browser',
          env,
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
