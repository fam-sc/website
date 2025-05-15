import { CheckIcon } from '@/icons/CheckIcon';
import { CloseIcon } from '@/icons/CloseIcon';
import { IconButton } from '../IconButton';
import { useState } from 'react';

import styles from './index.module.scss';
import { UserInfoItem, UserInfoItemProps } from '../UserInfoItem';

type ActionType = 'approve' | 'disapprove';

export interface UserApproveItemProps
  extends Omit<UserInfoItemProps, 'children'> {
  onAction: (type: ActionType) => Promise<void>;
}

export function UserApproveItem({ onAction, ...rest }: UserApproveItemProps) {
  const [actionInProgress, setActionInProgress] = useState(false);

  function doAction(type: ActionType) {
    setActionInProgress(true);

    const reset = () => {
      setActionInProgress(false);
    };

    onAction(type).then(reset).catch(reset);
  }

  return (
    <UserInfoItem {...rest}>
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
    </UserInfoItem>
  );
}
