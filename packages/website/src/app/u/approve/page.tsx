import {
  approveUser,
  disapproveUser,
  getUsersForApprove,
} from '@/api/users/client';
import { useDataLoader } from '@/hooks/useDataLoader';

import styles from './page.module.scss';
import {
  UserApproveBoard,
  UserApproveItemType,
} from '@/components/UserApproveBoard';
import { useCallback } from 'react';
import { getMediaFileUrl } from '@/api/media';
import { Typography } from '@/components/Typography';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { DataLoadingContainer } from '@/components/DataLoadingContainer';
import { useNavigate } from 'react-router';
import { Title } from '@/components/Title';

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
