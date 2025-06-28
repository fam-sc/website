import { changeUserRole, getAllUsers } from '@/api/users/client';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { useNotification } from '@/components/Notification';
import { UserRoleBoard } from '@/components/UserRoleBoard';
import { usePageFetcher } from '@/hooks/usePageFetcher';
import { startTransition, useCallback, useOptimistic } from 'react';

import styles from './page.module.scss';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { useNavigate } from 'react-router';
import { Title } from '@/components/Title';

export default function Page() {
  const { user } = useAuthInfo();
  const navigate = useNavigate();

  if (user === null || user.role < UserRole.ADMIN) {
    void navigate('/');
  }

  const notification = useNotification();
  const { items, setItems, hasMoreItems, onRequestNextPage } = usePageFetcher(
    getAllUsers,
    () => {
      notification.show('Не вдалось завантажити користувачів', 'error');
    }
  );

  const [optimisticItems, setOptimisticItems] = useOptimistic(items);

  const onChangeRole = useCallback(
    (id: number, role: UserRole) => {
      startTransition(() => {
        setOptimisticItems((t) =>
          t.map((item) => (item.id === id ? { ...item, role } : item))
        );

        startTransition(async () => {
          await changeUserRole(id, role);

          startTransition(() => {
            setItems((t) =>
              t.map((item) => (item.id === id ? { ...item, role } : item))
            );
          });
        });
      });
    },
    [setItems, setOptimisticItems]
  );

  return (
    <div className={styles.content}>
      <Title>Зміна ролей</Title>

      <InfiniteScroll
        hasMoreElements={hasMoreItems}
        onRequesNextPage={onRequestNextPage}
      >
        <UserRoleBoard
          className={styles.list}
          users={optimisticItems}
          onChangeRole={onChangeRole}
        />
      </InfiniteScroll>
    </div>
  );
}
