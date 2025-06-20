import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';
import mogran from 'morgan';
import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { ServerBuild } from 'react-router';
import { loadEnvFile } from 'node:process';

const PORT = 3000;

async function run() {
  loadEnvFile('.env');

  if (fs.existsSync('.env.local')) {
    loadEnvFile('.env.local');
  }

  process.env.NODE_ENV = 'production';

  const buildPathArg = process.argv[2];
  if (!buildPathArg) {
    console.error(`
  Usage: yarn start <server-build-path> - e.g. yarn start build/server/index.js`);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
  const buildPath = path.resolve(buildPathArg);

  console.log('Importing the build');
  const build = (await import(
    url.pathToFileURL(buildPath).href
  )) as ServerBuild;

  const app = express();
  app.disable('x-powered-by');
  app.use(
    path.posix.join(build.publicPath, 'assets'),
    express.static(path.join(build.assetsBuildDirectory, 'assets'), {
      immutable: true,
      maxAge: '1y',
    })
  );
  app.use(build.publicPath, express.static(build.assetsBuildDirectory));
  app.use(express.static('public', { maxAge: '1h' }));
  app.use(mogran('tiny'));
  app.use(
    '*',
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    })
  );

  console.log(`Starting the server: http://localhost:${PORT}/`);
  const server = app.listen(PORT);
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.once(signal, () => server.close(console.error));
  }
}

void run();
