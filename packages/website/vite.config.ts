import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {cloudflare} from '@cloudflare/vite-plugin';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  esbuild: {
    target: "es2022",
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
    tsconfigPaths(),
  ],
});