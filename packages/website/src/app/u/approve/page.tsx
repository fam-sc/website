import { UserRole } from '@data/types/user';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { getMediaFileUrl } from '@/api/media';
import {
  approveUser,
  disapproveUser,
  getUsersForApprove,
} from '@/api/users/client';
import { useAuthInfo } from '@/auth/context';
import { DataLoadingContainer } from '@/components/DataLoadingContainer';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import {
  UserApproveBoard,
  UserApproveItemType,
} from '@/components/UserApproveBoard';
import { useDataLoader } from '@/hooks/useDataLoader';

import styles from './page.module.scss';

export default function Page() {
  const { user } = useAuthInfo();
  const redirect = useNavigate();

  if (user === null || user.role < UserRole.ADMIN) {
    void redirect('/');
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
    async (id: number, type: 'approve' | 'disapprove') => {
      await (type === 'approve' ? approveUser(id) : disapproveUser(id));

      if (typeof users === 'object') {
        setUsers(users.value.filter((user) => user.id !== id));
      }
    },
    [users, setUsers]
  );

  return (
    <div>
      <Title>Підтвердження користувачів</Title>

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
