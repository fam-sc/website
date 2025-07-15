import { repeatJoin } from '@shared/string/repeatJoin';

export function qMarks(n: number): string {
  return repeatJoin('?', ',', n);
}
