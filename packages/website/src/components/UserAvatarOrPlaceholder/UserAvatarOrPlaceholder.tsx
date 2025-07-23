import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { UnknownUserAvatar } from '../UnknownUserAvatar';
import styles from './UserAvatarOrPlaceholder.module.scss';

type DivProps = PropsMap['div'];

export interface UserAvatarOrPlaceholderProps extends DivProps {
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
