import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    pool: 'threads',
    env: loadEnv('', './packages/website', ''),
    projects: [
      {
        plugins: [react(), tsconfigPaths()],
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
