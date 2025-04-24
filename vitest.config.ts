import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    pool: 'threads',
    env: loadEnv('', './packages/website', ''),
  },
});
