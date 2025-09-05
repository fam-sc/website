import { PastMediaEntryType } from '@/data/types';

export type ImageSourceMap = Record<`${number}`, string>;

interface BasePastMediaEntry {
  id: number;
  path: string;
}

interface ImagePastMediaEntry extends BasePastMediaEntry {
  type: PastMediaEntryType.IMAGE;
  path: string;
  alternative: ImageSourceMap;
}

interface VideoPastMediaEntry extends BasePastMediaEntry {
  type: PastMediaEntryType.VIDEO;
  thumbnail: string;
}

export type PastMediaEntry = ImagePastMediaEntry | VideoPastMediaEntry;
