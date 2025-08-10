import { useCallback, useEffect, useMemo, useState } from 'react';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { VSCodeContext, VSCodeContextType } from './components/VSCodeContext';
import { VSCodeFile } from './types';
import styles from './VSCode.module.scss';

type DivProps = PropsMap['div'];

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
  const [recentlyOpened, setRecentlyOpened] = useState<VSCodeFile[]>([]);
  const [openedFiles, setOpenedFiles] = useState<VSCodeFile[]>([]);
  const [currentFile, setCurrentFile] = useState<VSCodeFile | null>(null);

  const openFile = useCallback(
    (path: string) => {
      const file = files.find((file) => file.path === path);

      if (file) {
        setCurrentFile(file);
        setRecentlyOpened((rest) => [...rest, file]);
        setOpenedFiles((rest) => [...new Set([...rest, file])]);
      }
    },
    [files]
  );

  const closeFile = useCallback(
    (path: string) => {
      const index = files.findIndex((file) => file.path === path);

      if (index !== -1) {
        const newIndex = index > 0 ? index - 1 : index + 1;

        setCurrentFile(files[newIndex]);

        setOpenedFiles((files) => files.filter((file) => file.path !== path));
      }
    },
    [files]
  );

  const context = useMemo(
    (): VSCodeContextType => ({
      recentlyOpened,
      currentFile,
      projectName,
      files,
      openedFiles,
      openFile,
      closeFile,
    }),
    [
      recentlyOpened,
      currentFile,
      projectName,
      files,
      openedFiles,
      openFile,
      closeFile,
    ]
  );

  useEffect(() => {
    if (initialOpenedFile !== undefined) {
      openFile(initialOpenedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFile]);

  return (
    <VSCodeContext.Provider value={context}>
      <div className={classNames(styles.root, className)} {...rest}>
        <Header />
        <Main />
      </div>
    </VSCodeContext.Provider>
  );
}
