import { finishAuthToScheduleBot } from '@/api/schedulebot/client';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { useNotification } from '@/components/Notification';
import { TelegramLoginWidget } from '@/components/TelegramLoginWidget';
import { Typography } from '@/components/Typography';
import { useState } from 'react';

type State = 'widget' | 'pending' | 'success';

export default function Page() {
  const [state, setState] = useState<State>('widget');

  const notification = useNotification();

  return (
    <div>
      {state === 'pending' ? (
        <IndeterminateCircularProgress />
      ) : state === 'success' ? (
        <Typography>
          Успішно! Ви можете закрити цю сторінку та повернутися до бота
        </Typography>
      ) : (
        <TelegramLoginWidget
          bot="famschedulebot"
          onCallback={({ auth_date, first_name, username, hash, id }) => {
            setState('pending');

            finishAuthToScheduleBot({
              userId: '',
              hash,
              username,
              firstName: first_name,
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
