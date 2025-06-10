import type { Config } from '@react-router/dev/config';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  appDirectory: './src/app',
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
