

import { changeUserRole, getAllUsers } from '@/api/user/client';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { useNotification } from '@/components/Notification';
import { UserRoleBoard } from '@/components/UserRoleBoard';
import { usePageFetcher } from '@/hooks/usePageFetcher';
import { startTransition, useOptimistic } from 'react';

import styles from './page.module.scss';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { useNavigate } from 'react-router';

export function ClientComponent() {
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

  return (
    <div className={styles.content}>
      <title>Зміна ролей</title>

      <InfiniteScroll
        hasMoreElements={hasMoreItems}
        onRequesNextPage={onRequestNextPage}
      >
        <UserRoleBoard
          className={styles.list}
          users={optimisticItems}
          onChangeRole={(id, role) => {
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
          }}
        />
      </InfiniteScroll>
    </div>
  );
}
