import { PastMediaEntryType } from '@/data/types';

export type PastMediaEntry = {
  id: number;
  type: PastMediaEntryType;
  path: string;
};
