import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';
import { useCallback, useEffect, useState } from 'react';

import { BotType } from '@/api/users/botAuth/types';
import { authorizeTelegramBotToUser } from '@/api/users/client';
import { ErrorMessage } from '@/components/ErrorMessage';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { Typography } from '@/components/Typography';

import styles from './index.module.scss';

export const enum BotPageError {
  INVALID_PARAMS = 0,
}

interface BaseBotPageProps {
  type: BotType;
  auth: TelegramBotAuthPayload | null;
  error: BotPageError | null;
}

type State = 'loading' | 'error' | 'success';

export function BaseBotPage({ type, auth, error }: BaseBotPageProps) {
  const [state, setState] = useState<State>('loading');

  const doLoad = useCallback(() => {
    if (auth !== null) {
      setState('loading');

      authorizeTelegramBotToUser(type, auth)
        .then(() => {
          setState('success');
        })
        .catch((error: unknown) => {
          console.error(error);

          setState('error');
        });
    }
  }, [auth, type]);

  useEffect(() => {
    doLoad();
  }, [doLoad]);

  return (
    <div className={styles.root}>
      {error === BotPageError.INVALID_PARAMS ? (
        <Typography>Неправильне посилання</Typography>
      ) : state === 'loading' ? (
        <IndeterminateCircularProgress />
      ) : state === 'error' ? (
        <ErrorMessage onRetry={doLoad}>Сталася помилка</ErrorMessage>
      ) : (
        <Typography variant="h5">
          Успішно! Можете закрити цю сторінку
        </Typography>
      )}
    </div>
  );
}
