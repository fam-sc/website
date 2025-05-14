import { CheckIcon } from '@/icons/CheckIcon';
import { CloseIcon } from '@/icons/CloseIcon';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';
import Image from 'next/image';
import { useState } from 'react';

import styles from './index.module.scss';
import { UnknownUserAvatar } from '../UnknownUserAvatar';

type ActionType = 'approve' | 'disapprove';

export type UserApproveItemProps = {
  avatarSrc?: string;
  name: string;
  email: string;
  group: string;

  onAction: (type: ActionType) => Promise<void>;
};

export function UserApproveItem({
  avatarSrc,
  name,
  email,
  group,
  onAction,
}: UserApproveItemProps) {
  const [actionInProgress, setActionInProgress] = useState(false);

  function doAction(type: ActionType) {
    setActionInProgress(true);

    onAction(type)
      .then(() => {
        setActionInProgress(false);
      })
      .catch(() => {
        setActionInProgress(false);
      });
  }

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

      <div className={styles.actions}>
        <IconButton
          disabled={actionInProgress}
          hover="fill"
          onClick={() => {
            doAction('disapprove');
          }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          disabled={actionInProgress}
          hover="fill"
          onClick={() => {
            doAction('approve');
          }}
        >
          <CheckIcon />
        </IconButton>
      </div>
    </li>
  );
}
