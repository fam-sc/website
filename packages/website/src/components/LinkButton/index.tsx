import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';

import { Button, ButtonProps } from '../Button';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export type LinkButtonProps = LinkProps &
  ButtonProps & {
    children?: ReactNode;
  };

export function LinkButton({ className, ...rest }: LinkButtonProps) {
  return (
    <Button
      as={Link}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
