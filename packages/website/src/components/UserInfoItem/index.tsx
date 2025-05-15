import { Typography } from '../Typography';
import Image from 'next/image';
import { ReactNode } from 'react';

import styles from './index.module.scss';
import { UnknownUserAvatar } from '../UnknownUserAvatar';

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
      <div className={styles.avatar} aria-hidden>
        {avatarSrc === undefined ? (
          <UnknownUserAvatar />
        ) : (
          <Image src={avatarSrc} alt="" width={0} height={0} />
        )}
      </div>

      <div className={styles.info}>
        <Typography>{name}</Typography>
        <Typography>{email}</Typography>
        <Typography>{group}</Typography>
      </div>

      {children}
    </li>
  );
}
