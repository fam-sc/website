import { isErrorWithCode } from '.';

function helper(code: number): (value: unknown) => boolean {
  return (value) => isErrorWithCode(value, code);
}

export const isDuplicateKeyError = helper(11_000);
