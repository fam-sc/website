import { ReactNode } from 'react';

import { DataState } from '@/hooks/useDataLoader';
import { classNames } from '@/utils/classNames';

import { ErrorMessage } from '../ErrorMessage';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import styles from './index.module.scss';

export type DataLoadingContainerProps<T> = {
  value: DataState<T>;
  onRetry?: () => void;

  className?: string;

  children: (value: T) => ReactNode;
};

export function DataLoadingContainer<T>({
  value,
  onRetry,
  className,
  children,
}: DataLoadingContainerProps<T>) {
  return (
    <div className={classNames(styles.root, className)}>
      {value === 'pending' ? (
        <IndeterminateCircularProgress />
      ) : value === 'error' ? (
        <ErrorMessage className={styles.error} onRetry={onRetry}>
          Сталася помилка при завантаженні даних
        </ErrorMessage>
      ) : (
        children(value.value)
      )}
    </div>
  );
}
