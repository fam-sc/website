import { classNames } from '@/utils/classNames';
import { ReactNode } from 'react';

import styles from './index.module.scss';
import { Typography } from '../Typography';
import { Button } from '../Button';

export type ErrorMessageProps = {
  onRetry?: () => void;
  className?: string;
  children: ReactNode;
};

export function ErrorMessage({
  className,
  onRetry,
  children,
}: ErrorMessageProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Typography>{children}</Typography>

      {onRetry && (
        <Button
          className={styles.retry}
          buttonVariant="outlined"
          onClick={onRetry}
        >
          Повторити
        </Button>
      )}
    </div>
  );
}
