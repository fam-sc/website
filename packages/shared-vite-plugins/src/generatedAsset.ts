import fs from 'node:fs/promises';
import path from 'node:path';

import { isPromise } from '@sc-fam/shared';
import { Plugin, ResolvedConfig } from 'vite';

type FactoryOptions = {
  pluginName: string;
  outputName: string;
  contentType: string;
  generator: (mode: string) => string | Promise<string>;
};

export function generatedAssetFactory({
  outputName,
  contentType,
  pluginName,
  generator,
}: FactoryOptions) {
  let config: ResolvedConfig;

  return (): Plugin[] => [
    {
      name: `${pluginName}:build`,
      apply: 'build',
      configResolved(_config) {
        config = _config;
      },
      async writeBundle() {
        if (!config.build.ssr) {
          const content = await generator(config.mode);

          await fs.writeFile(
            path.join(config.build.outDir, 'client', outputName),
            content
          );
        }
      },
    },
    {
      name: `${pluginName}:serve`,
      apply: 'serve',
      configResolved(_config) {
        config = _config;
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url !== `/${outputName}`) {
            next();
            return;
          }

          const tempOutput = generator(config.mode);
          const outputPromise = isPromise(tempOutput)
            ? tempOutput
            : Promise.resolve(tempOutput);

          outputPromise
            .then((output) => {
              res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
              });

              res.end(output);
            })
            .catch(() => {
              res.writeHead(500);
              res.end('Server Internal Error');
            });
        });
      },
    },
  ];
}
