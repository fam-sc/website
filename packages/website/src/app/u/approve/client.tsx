'use client';

import {
  approveUser,
  disapproveUser,
  getUsersForApprove,
} from '@/api/user/client';
import { useDataLoader } from '@/hooks/useDataLoader';

import styles from './page.module.scss';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import {
  UserApproveBoard,
  UserApproveItemType,
} from '@/components/UserApproveBoard';
import { useCallback, useMemo } from 'react';
import { getMediaFileUrl } from '@shared/media';
import { Typography } from '@/components/Typography';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { redirect } from 'next/navigation';

export function ClientComponent() {
  const { user } = useAuthInfo();
  if (user === null || user.role < UserRole.ADMIN) {
    redirect('/');
  }

  const [users, isPending, setUsers] = useDataLoader(getUsersForApprove, []);
  const approveItems = useMemo((): UserApproveItemType[] | undefined => {
    return users?.map(({ id, email, name, group, hasAvatar }) => ({
      id,
      email,
      name,
      group,
      avatarSrc: hasAvatar ? getMediaFileUrl(`user/${id}`) : undefined,
    }));
  }, [users]);

  const onItemAction = useCallback(
    async (id: string, type: 'approve' | 'disapprove') => {
      await (type === 'approve' ? approveUser(id) : disapproveUser(id));

      setUsers((users) => users?.filter((user) => user.id !== id));
    },
    [setUsers]
  );

  return (
    <div>
      <Typography>
        Підтвердіть, що ці користувачі це студенти вашої групи
      </Typography>
      <div className={styles.itemsContainer}>
        {isPending ? (
          <IndeterminateCircularProgress className={styles.progress} />
        ) : (
          approveItems && (
            <UserApproveBoard
              className={styles.items}
              items={approveItems}
              onItemAction={onItemAction}
            />
          )
        )}
      </div>
    </div>
  );
}
