import { isErrorWithCode } from './code.js';

export function isFileNotFoundError(error: unknown): boolean {
  return isErrorWithCode(error, 'ENOENT');
}
