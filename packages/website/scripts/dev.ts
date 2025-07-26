import { spawn } from 'node:child_process';
import path from 'node:path';

async function runAndRedirectOutput(
  command: string,
  args: string[],
  signal: AbortSignal,
  packageName: string,
  cwd?: string
): Promise<void> {
  return new Promise((resolve) => {
    const p = spawn(command, args, {
      cwd,
      signal,
      shell: true,
      detached: false,
    });

    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);

    p.on('spawn', () => {
      console.log(`> ${packageName}: started`);
    });

    p.on('error', (error) => {
      console.log(`> ${packageName}: ${error}`);
    });

    p.on('exit', resolve);
  });
}

async function runDependenciesDev(signal: AbortSignal) {
  const cwd = path.join(import.meta.dirname, '../../../');

  await runAndRedirectOutput('yarn', ['prebuild:watch'], signal, 'deps', cwd);
}

async function runWebsiteDev(signal: AbortSignal) {
  const cwd = path.join(import.meta.dirname, '../');

  await runAndRedirectOutput(
    'yarn',
    ['react-router', 'dev'],
    signal,
    'website',
    cwd
  );
}

async function main() {
  const abortController = new AbortController();

  for (const signalName of ['SIGTERM', 'SIGINT']) {
    process.on(signalName, () => abortController.abort());
  }

  const { signal } = abortController;

  await Promise.all([runDependenciesDev(signal), runWebsiteDev(signal)]);

  abortController.abort();
}

void main();
