import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import { DataState, SuccessDataState } from '@/hooks/useDataLoader';

import { IndeterminateCircularProgress } from '../../../../shared-ui/src/components/IndeterminateCircularProgress';
import { ErrorMessage } from '../ErrorMessage';
import styles from './DataLoadingContainer.module.scss';

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
    <div
      className={classNames(
        styles.root,
        value.type === 'success' && styles['root-success'],
        className
      )}
    >
      {value.type === 'pending' ? (
        <IndeterminateCircularProgress className={styles.progress} />
      ) : value.type === 'error' ? (
        <ErrorMessage className={styles.error} onRetry={onRetry}>
          Сталася помилка при завантаженні даних
        </ErrorMessage>
      ) : (
        children((value as SuccessDataState<T>).value)
      )}
    </div>
  );
}
