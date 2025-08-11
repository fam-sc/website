import { FC } from 'react';

import { FilesIcon } from '@/icons/FilesIcon';
import { SvgProps } from '@/icons/types';
import { classNames } from '@/utils/classNames';

import styles from './SideToolbar.module.scss';

type TabMap = Record<
  string,
  {
    icon: FC<SvgProps>;
  }
>;

const tabs = {
  files: {
    icon: FilesIcon,
  },
} satisfies TabMap;

export type ToolbarTabType = keyof typeof tabs;

export interface SideToolbarProps {
  className?: string;
  selectedTab?: ToolbarTabType;
  onSelectedTabChanged: (type: ToolbarTabType | undefined) => void;
}

export function SideToolbar({
  className,
  selectedTab,
  onSelectedTabChanged,
}: SideToolbarProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {Object.entries(tabs).map(([name, { icon: Icon }]) => (
        <button
          key={name}
          className={classNames(
            styles.item,
            selectedTab === name && styles['item-selected']
          )}
          onClick={() => {
            if (name === selectedTab) {
              onSelectedTabChanged(undefined);
            } else {
              onSelectedTabChanged(name as ToolbarTabType);
            }
          }}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
