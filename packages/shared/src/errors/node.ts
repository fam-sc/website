import { isErrorWithCode } from '.';

export function isFileNotFoundError(error: unknown): boolean {
  return isErrorWithCode(error, 'ENOENT');
}
