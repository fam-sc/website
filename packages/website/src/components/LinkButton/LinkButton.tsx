import { PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Button, ButtonProps } from '../Button';
import styles from './LinkButton.module.scss';

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
