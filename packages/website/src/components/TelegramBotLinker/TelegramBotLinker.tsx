import { useNotification } from '@sc-fam/shared-ui';
import { useState } from 'react';

import { isApiError } from '@/api/error';
import { ApiErrorCode } from '@/api/errorCodes';
import { BotType } from '@/api/users/botAuth/types';
import { authorizeTelegramBotToUser } from '@/api/users/client';

import { IndeterminateCircularProgress } from '../../../../shared-ui/src/components/IndeterminateCircularProgress';
import { TelegramLoginWidget } from '../TelegramLoginWidget';

type State = 'widget' | 'pending';

export interface TelegramBotLinkerProps {
  bot: string;
  botType: BotType;
  onAuthorized?: () => void;
}

export function TelegramBotLinker({
  bot,
  botType,
  onAuthorized,
}: TelegramBotLinkerProps) {
  const [state, setState] = useState<State>('widget');

  const notification = useNotification();

  return (
    <div>
      {state === 'pending' ? (
        <IndeterminateCircularProgress />
      ) : (
        <TelegramLoginWidget
          bot={bot}
          onCallback={(payload) => {
            setState('pending');

            authorizeTelegramBotToUser(botType, payload)
              .then(() => {
                onAuthorized?.();
              })
              .catch((error: unknown) => {
                console.error(error);

                setState('widget');

                const isLinked = isApiError(
                  error,
                  ApiErrorCode.TELEGRAM_USER_ALREADY_LINKED
                );

                const message = isLinked
                  ? 'Цей телеграм акаунт вже використовується'
                  : 'Сталася помилка при авторизації';

                notification.show(message, 'error');
              });
          }}
        />
      )}
    </div>
  );
}
