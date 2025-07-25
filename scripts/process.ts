import { execFile } from 'node:child_process';

export function execFileAsync(file: string, args: string[], cwd?: string) {
  return new Promise((resolve, reject) => {
    execFile(file, args, { cwd, shell: true }, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      } else {
        resolve(`${stdout}\n${stderr}`);
      }
    });
  });
}

export function yarn(args: string[], cwd?: string) {
  return execFileAsync('yarn', args, cwd);
}
