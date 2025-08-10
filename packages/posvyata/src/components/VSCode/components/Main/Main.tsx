import { FC, useState } from 'react';

import { classNames } from '@/utils/classNames';

import { EditorWrapper } from '../EditorWrapper';
import { FilesTab } from '../FilesTab';
import { SideToolbar, ToolbarTabType } from '../SideToolbar';
import styles from './Main.module.scss';

export interface MainProps {
  className?: string;
}

const tabs: Record<ToolbarTabType, FC> = {
  files: FilesTab,
  search: () => null,
};

export function Main({ className }: MainProps) {
  const [selectedTab, setSelectedTab] = useState<ToolbarTabType>();

  const Tab = selectedTab ? tabs[selectedTab] : null;

  return (
    <div className={classNames(styles.root, className)}>
      <SideToolbar
        selectedTab={selectedTab}
        onSelectedTabChanged={setSelectedTab}
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
