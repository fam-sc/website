import { classNames } from '@/utils/classNames';

import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import styles from './LoadingIndicatorWrapper.module.scss';

export interface LoadingIndicatorWrapperProps {
  className?: string;
}

export function LoadingIndicatorWrapper({
  className,
}: LoadingIndicatorWrapperProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <LoadingIndicator />
    </div>
  );
}
