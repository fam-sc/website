import fs from 'node:fs/promises';
import path from 'node:path';

import { Plugin, ResolvedConfig } from 'vite';

import { manifest } from '../src/app/manifest';

export function manifestPlugin(): Plugin[] {
  let config: ResolvedConfig;

  return [
    {
      name: 'manifest:build',
      apply: 'build',
      configResolved(_config) {
        config = _config;
      },
      async writeBundle() {
        if (!config.build.ssr) {
          await fs.writeFile(
            path.join(config.build.outDir, 'client', 'manifest.json'),
            JSON.stringify(manifest)
          );
        }
      },
    },
    {
      name: 'manifest:serve',
      apply: 'serve',
      configResolved(_config) {
        config = _config;
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url !== '/manifest.json') {
            next();
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          });
          res.end(JSON.stringify(manifest));
        });
      },
    },
  ];
}
