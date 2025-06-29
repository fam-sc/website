import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import { createRequestHandler } from '@react-router/express';
import { config } from 'dotenv';
import express from 'express';
import mogran from 'morgan';
import { ServerBuild } from 'react-router';

const PORT = 3000;

async function run() {
  config({ path: '.env', quiet: true });

  if (fs.existsSync('.env.local')) {
    config({ path: '.env.local', quiet: true });
  }

  process.env.NODE_ENV = 'production';

  const buildPathArg = process.argv[2];
  if (!buildPathArg) {
    return;
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
