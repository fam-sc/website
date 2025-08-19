import { FC } from 'react';

import { classNames } from '@/utils/classNames';

import { EditorWrapper } from '../EditorWrapper';
import { FilesTab } from '../FilesTab';
import { SideToolbar, ToolbarTabType } from '../SideToolbar';
import { useVSCode } from '../VSCodeContext';
import styles from './Main.module.scss';

export interface MainProps {
  className?: string;
}

const tabs: Record<ToolbarTabType, FC> = {
  files: FilesTab,
};

export function Main({ className }: MainProps) {
  const { sidebarTab, setSidebarType } = useVSCode();
  const Tab = sidebarTab ? tabs[sidebarTab] : null;

  return (
    <div className={classNames(styles.root, className)}>
      <SideToolbar
        selectedTab={sidebarTab}
        onSelectedTabChanged={setSidebarType}
      />

      {Tab && (
        <div className={styles['tab-wrapper']}>
          <Tab />
        </div>
      )}

      <EditorWrapper className={styles.editor} />
    </div>
  );
}
