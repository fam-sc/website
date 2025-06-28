import { repeatJoin } from '../../../shared/src/string/repeatJoin';

export function qMarks(n: number): string {
  return repeatJoin('?', ',', n);
}
