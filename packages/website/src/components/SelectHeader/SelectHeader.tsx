import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import { ArrowDownIcon } from '@/icons/ArrowDownIcon';

import styles from './SelectHeader.module.scss';

export type SelectHeaderProps = ComponentProps<'button'>;

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
