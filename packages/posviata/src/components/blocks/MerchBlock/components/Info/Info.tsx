import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { classNames } from '@/utils/classNames';

import styles from './Info.module.scss';

export interface InfoProps {
  className?: string;
}

export function Info({ className }: InfoProps) {
  return (
    <Typography className={classNames(styles.root, className)}>
      <InfoIcon />
      Можна купити на посвяті
    </Typography>
  );
}
