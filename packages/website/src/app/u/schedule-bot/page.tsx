import { useState } from 'react';

import { authorizeScheduleBotToUser } from '@/api/users/client';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { useNotification } from '@/components/Notification';
import { TelegramLoginWidget } from '@/components/TelegramLoginWidget';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

type State = 'widget' | 'pending' | 'success';

export default function Page() {
  const [state, setState] = useState<State>('widget');

  const notification = useNotification();

  return (
    <div className={styles.root}>
      {state === 'pending' ? (
        <IndeterminateCircularProgress className={styles.progress} />
      ) : state === 'success' ? (
        <Typography>
          Успішно! Ви можете закрити цю сторінку та повернутися до бота
        </Typography>
      ) : (
        <TelegramLoginWidget
          bot="famschedulebot"
          onCallback={({
            auth_date,
            first_name,
            photo_url,
            username,
            hash,
            id,
          }) => {
            setState('pending');

            authorizeScheduleBotToUser({
              hash,
              username,
              firstName: first_name,
              photoUrl: photo_url,
              telegramUserId: id,
              authDate: auth_date,
            })
              .then(() => {
                setState('success');
              })
              .catch((error: unknown) => {
                console.error(error);

                setState('widget');

                notification.show('Сталася помилка при авторизації', 'error');
              });
          }}
        />
      )}
    </div>
  );
}
