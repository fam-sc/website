import { createContext, useContext } from 'react';

import { VSCodeFile } from '../../types';

export type VSCodeContextType = {
  projectName: string;
  files: VSCodeFile[];
  recentlyOpened: VSCodeFile[];
  openedFiles: VSCodeFile[];
  currentFile: VSCodeFile | null;

  openFile: (path: string) => void;
  closeFile: (path: string) => void;
};

export const VSCodeContext = createContext<VSCodeContextType | null>(null);

export function useVSCode(): VSCodeContextType {
  const result = useContext(VSCodeContext);
  if (result === null) {
    throw new Error('No VSCodeContext in the tree');
  }

  return result;
}
