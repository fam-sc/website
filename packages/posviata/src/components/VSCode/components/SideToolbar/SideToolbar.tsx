import { FC } from 'react';

import { FilesIcon } from '@/icons/FilesIcon';
import { SvgProps } from '@/icons/types';
import { classNames } from '@/utils/classNames';

import { SidebarTab } from '../../types';
import styles from './SideToolbar.module.scss';

type TabMap = Record<
  SidebarTab,
  {
    icon: FC<SvgProps>;
    title: string;
  }
>;

const tabs: TabMap = {
  files: {
    icon: FilesIcon,
    title: 'Файли',
  },
};

export type ToolbarTabType = keyof typeof tabs;

export interface SideToolbarProps {
  className?: string;
  selectedTab: ToolbarTabType | null;
  onSelectedTabChanged: (type: ToolbarTabType | null) => void;
}

export function SideToolbar({
  className,
  selectedTab,
  onSelectedTabChanged,
}: SideToolbarProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {Object.entries(tabs).map(([name, { icon: Icon, title }]) => (
        <button
          key={name}
          title={title}
          className={classNames(
            styles.item,
            selectedTab === name && styles['item-selected']
          )}
          onClick={() => {
            const newTab =
              name === selectedTab ? null : (name as ToolbarTabType);

            onSelectedTabChanged(newTab);
          }}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
