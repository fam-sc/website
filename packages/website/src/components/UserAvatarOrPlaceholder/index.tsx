import Image from 'next/image';
import { UnknownUserAvatar } from '../UnknownUserAvatar';
import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';
import { PropsMap } from '@/types/react';

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
      {src ? (
        <Image src={src} alt="" width={0} height={0} />
      ) : (
        <UnknownUserAvatar />
      )}
    </div>
  );
}
