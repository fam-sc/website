'use client';

import {
  approveUser,
  disapproveUser,
  getUsersForApprove,
} from '@/api/user/client';
import { useDataLoader } from '@/hooks/useDataLoader';

import styles from './page.module.scss';
import {
  UserApproveBoard,
  UserApproveItemType,
} from '@/components/UserApproveBoard';
import { useCallback } from 'react';
import { getMediaFileUrl } from '@shared/api/media';
import { Typography } from '@/components/Typography';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { redirect } from 'next/navigation';
import { DataLoadingContainer } from '@/components/DataLoadingContainer';

export function ClientComponent() {
  const { user } = useAuthInfo();
  if (user === null || user.role < UserRole.ADMIN) {
    redirect('/');
  }

  const [users, onRetry, setUsers] = useDataLoader(async () => {
    const users = await getUsersForApprove();

    return users.map(
      ({ id, hasAvatar, ...rest }): UserApproveItemType => ({
        ...rest,
        id,
        avatarSrc: hasAvatar ? getMediaFileUrl(`user/${id}`) : undefined,
      })
    );
  }, []);

  const onItemAction = useCallback(
    async (id: string, type: 'approve' | 'disapprove') => {
      await (type === 'approve' ? approveUser(id) : disapproveUser(id));

      if (typeof users === 'object') {
        setUsers(users.value.filter((user) => user.id !== id));
      }
    },
    [users, setUsers]
  );

  return (
    <div>
      <Typography>
        Підтвердіть, що ці користувачі це студенти вашої групи
      </Typography>

      <DataLoadingContainer
        className={styles.itemsContainer}
        value={users}
        onRetry={onRetry}
      >
        {(approveItems) => (
          <UserApproveBoard
            className={styles.items}
            items={approveItems}
            onItemAction={onItemAction}
          />
        )}
      </DataLoadingContainer>
    </div>
  );
}
