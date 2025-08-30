import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import { UnknownUserAvatar } from '../UnknownUserAvatar';
import styles from './UserAvatarOrPlaceholder.module.scss';

export interface UserAvatarOrPlaceholderProps extends ComponentProps<'div'> {
  src?: string;
}

export function UserAvatarOrPlaceholder({
  className,
  src,
  ...rest
}: UserAvatarOrPlaceholderProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      {src ? <img src={src} /> : <UnknownUserAvatar />}
    </div>
  );
}
