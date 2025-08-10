import { classNames } from '@/utils/classNames';

import { VSCodeFile } from '../../types';
import styles from './HeaderProjectNavigation.module.scss';
import { SearchIcon } from '@/icons/SearchIcon';
import { Typography } from '@/components/Typography';
import { useVSCode } from '../VSCodeContext';

export interface HeaderProjectNavigationProps {
  className?: string;
}

export function HeaderProjectNavigation({
  className,
}: HeaderProjectNavigationProps) {
  const { projectName } = useVSCode();

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.content}>
        <SearchIcon />
        <Typography>{projectName}</Typography>
      </div>
    </div>
  );
}
