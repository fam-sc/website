import { IconButton } from '@sc-fam/shared-ui';
import { useState } from 'react';

import { CheckIcon } from '@/icons/CheckIcon';
import { CloseIcon } from '@/icons/CloseIcon';

import { UserInfoItem, UserInfoItemProps } from '../UserInfoItem';
import styles from './UserApproveItem.module.scss';

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
          title="Видалити користувача"
          onClick={() => {
            doAction('disapprove');
          }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          disabled={actionInProgress}
          hover="fill"
          title="Підтвердити користувача"
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
