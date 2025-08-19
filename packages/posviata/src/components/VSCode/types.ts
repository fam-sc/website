import { RawMarkdownString } from '@/utils/markdown/types';

export type SidebarTab = 'files';

export type VSCodeFile =
  | {
      type: 'markdown';
      path: string;
      content: RawMarkdownString;
    }
  | {
      type: 'image';
      path: string;
      url: string;
    };

export type VSCodeFileType = VSCodeFile['type'];
