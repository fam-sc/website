import { createContext, useContext } from 'react';

import { SidebarTab, VSCodeFile } from '../../types';

export type VSCodeContextType = {
  projectName: string;
  files: VSCodeFile[];
  openedFiles: VSCodeFile[];
  currentFile: VSCodeFile | null;
  sidebarTab: SidebarTab | null;

  setSidebarType: (type: SidebarTab | null) => void;
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
