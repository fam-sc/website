import { finishSignUp } from '@/api/users/client';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { LinkButton } from '@/components/LinkButton';
import { Typography } from '@/components/Typography';
import { useEffect, useState } from 'react';

import styles from './page.module.scss';
import { useSearchParams } from 'react-router';

type State = 'pending' | 'success' | 'error';

export function ClientComponent() {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<State>('pending');

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      finishSignUp(token)
        .then(() => {
          setState('success');
        })
        .catch(() => {
          setState('error');
        });
    } else {
      setState('error');
    }
  }, [searchParams]);

  return (
    <div className={styles.root}>
      {state === 'pending' ? (
        <IndeterminateCircularProgress className={styles.progress} />
      ) : state === 'error' ? (
        <Typography variant="h5">
          Сталася помилка. Перевірте чи ви ввели правильне посилання
        </Typography>
      ) : (
        <div className={styles.success}>
          <Typography variant="h4">Успішно!</Typography>

          <LinkButton buttonVariant="outlined" href="/u/info" realNavigation>
            Перейти до профілю
          </LinkButton>
        </div>
      )}
    </div>
  );
}
