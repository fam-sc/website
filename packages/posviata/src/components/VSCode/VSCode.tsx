import { ComponentProps, useCallback, useMemo, useState } from 'react';

import { classNames } from '@/utils/classNames';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { VSCodeContext, VSCodeContextType } from './components/VSCodeContext';
import { SidebarTab, VSCodeFile } from './types';
import styles from './VSCode.module.scss';

type DivProps = ComponentProps<'div'>;

export interface VSCodeProps extends DivProps {
  projectName: string;
  initialOpenedFile?: string;
  files: VSCodeFile[];
}

export function VSCode({
  className,
  projectName,
  files,
  initialOpenedFile,
  ...rest
}: VSCodeProps) {
  const initialFile = files.find(({ path }) => path === initialOpenedFile);
  const [sidebarTab, setSidebarType] = useState<SidebarTab | null>(null);

  const [openedFiles, setOpenedFiles] = useState<VSCodeFile[]>(() =>
    initialFile ? [initialFile] : []
  );

  const [currentFile, setCurrentFile] = useState<VSCodeFile | null>(
    initialFile ?? null
  );

  const openFile = useCallback(
    (path: string) => {
      const file = files.find((file) => file.path === path);

      if (file) {
        setCurrentFile(file);
        setOpenedFiles((rest) =>
          rest.includes(file) ? rest : [...rest, file]
        );
      }
    },
    [files]
  );

  const closeFile = useCallback(
    (path: string) => {
      const index = openedFiles.findIndex((file) => file.path === path);

      if (index !== -1) {
        const newIndex = index > 0 ? index - 1 : index + 1;

        setCurrentFile(openedFiles[newIndex] ?? null);
        setOpenedFiles((files) => files.filter((file) => file.path !== path));
      }
    },
    [openedFiles]
  );

  const context = useMemo(
    (): VSCodeContextType => ({
      currentFile,
      projectName,
      files,
      openedFiles,
      sidebarTab,
      setSidebarType,
      openFile,
      closeFile,
    }),
    [
      currentFile,
      projectName,
      files,
      openedFiles,
      sidebarTab,
      openFile,
      closeFile,
    ]
  );

  return (
    <VSCodeContext.Provider value={context}>
      <div className={classNames(styles.root, className)} {...rest}>
        <Header />
        <Main />
      </div>
    </VSCodeContext.Provider>
  );
}
