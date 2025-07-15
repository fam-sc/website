import { ReactNode } from 'react';

import { Typography } from '../Typography';
import { UserAvatarOrPlaceholder } from '../UserAvatarOrPlaceholder';
import styles from './index.module.scss';

export type UserInfoItemProps = {
  avatarSrc?: string;
  name: string;
  email: string;
  group: string;

  children?: ReactNode;
};

export function UserInfoItem({
  avatarSrc,
  name,
  email,
  group,
  children,
}: UserInfoItemProps) {
  return (
    <li className={styles.root}>
      <UserAvatarOrPlaceholder
        aria-hidden
        src={avatarSrc}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <Typography>{name}</Typography>
        <Typography>{email}</Typography>
        <Typography>{group}</Typography>
      </div>

      {children}
    </li>
  );
}
