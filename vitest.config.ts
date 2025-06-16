import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

const env = loadEnv('', './packages/website', '');

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    pool: 'threads',
    projects: [
      {
        plugins: [react(), tsconfigPaths()],
        env,
        test: {
          include: ['**/*.test.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        plugins: [react(), tsconfigPaths()],
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
