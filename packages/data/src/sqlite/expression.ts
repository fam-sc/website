import { repeatJoin } from '@sc-fam/shared/string';

export function qMarks(n: number): string {
  return repeatJoin('?', ',', n);
}
