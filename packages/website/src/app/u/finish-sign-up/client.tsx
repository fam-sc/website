'use client';

import { finishSignUp } from '@/api/user/client';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { LinkButton } from '@/components/LinkButton';
import { Typography } from '@/components/Typography';
import { useEffect, useState } from 'react';

import styles from './page.module.scss';

export type ClientComponentProps = {
  token: string | undefined;
};

type State = 'pending' | 'success' | 'error';

export function ClientComponent({ token }: ClientComponentProps) {
  const [state, setState] = useState<State>(
    token !== undefined ? 'pending' : 'error'
  );

  useEffect(() => {
    if (token) {
      finishSignUp(token)
        .then(() => {
          setState('success');
        })
        .catch(() => {
          setState('error');
        });
    }
  }, [token]);

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
