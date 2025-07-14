import { ArrowDownIcon } from '@/icons/ArrowDownIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';

export type SelectHeaderProps = PropsMap['button'];

export function SelectHeader({
  className,
  children,
  ...rest
}: SelectHeaderProps) {
  return (
    <button className={classNames(styles.header, className)} {...rest}>
      {children}

      <ArrowDownIcon />
    </button>
  );
}
