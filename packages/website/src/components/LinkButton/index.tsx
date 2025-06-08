import { PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router';

import { Button, ButtonProps } from '../Button';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { PropsMap } from '@/types/react';

type AnchorProps = PropsMap['a'];

export type LinkButtonProps = PropsWithChildren<
  (
    | (LinkProps & { realNavigation?: false })
    | (AnchorProps & { realNavigation: true })
  ) &
    ButtonProps
>;

export function LinkButton({
  className,
  realNavigation,
  ...rest
}: LinkButtonProps) {
  return (
    <Button
      as={realNavigation ? 'a' : Link}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
