import { Typography } from '@/components/Typography';
import { SearchIcon } from '@/icons/SearchIcon';
import { classNames } from '@/utils/classNames';

import { useVSCode } from '../VSCodeContext';
import styles from './HeaderProjectNavigation.module.scss';

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
