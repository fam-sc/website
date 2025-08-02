import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

import { multienvPlugin } from './packages/website/vite-plugins/multienv';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

const env = loadEnv('', './packages/website', '');

const plugins = [react(), tsconfigPaths()];

export default defineConfig({
  plugins,
  test: {
    pool: 'threads',
    coverage: {
      exclude: ['**/storybook-static'],
    },
    projects: [
      defineWorkersProject({
        plugins: [multienvPlugin('mock')],
        test: {
          include: ['packages/website/**/*.cftest.ts'],
          name: 'cloudflare',
          env,
          poolOptions: {
            workers: {
              wrangler: { configPath: './packages/website/build/server/wrangler.json' },
              singleWorker: true,
              miniflare: {
                bindings: env,
              }
            },
          }
        },
      }),
      {
        plugins,
        test: {
          include: ['**/*.test.ts'],
          name: 'unit',
          env,
          environment: 'node',
        },
      },
      {
        plugins,
        test: {
          include: ['**/*.btest.{ts,tsx}'],
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
