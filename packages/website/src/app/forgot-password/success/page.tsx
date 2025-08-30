import { useNotification } from '@sc-fam/shared-ui';
import { useState } from 'react';
import { redirect, useNavigate } from 'react-router';

import { ApiError } from '@/api/error';
import { ApiErrorCode } from '@/api/errorCodes';
import { resetPassword } from '@/api/users/client';
import { Button } from '@/components/Button';
import { ErrorBoard } from '@/components/ErrorBoard';
import { Labeled } from '@/components/Labeled';
import { PasswordInput } from '@/components/PasswordInput';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (token === null) {
    return redirect('/');
  }

  const repo = repository(context);
  const exists = await repo
    .forgotPasswordEntries()
    .tokenExistsAndNotExpired(token, Date.now());

  if (!exists) {
    return redirect('/forgot-password/expired');
  }

  return { token };
}

export default function Page({ loaderData: { token } }: Route.ComponentProps) {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const notification = useNotification();

  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <Labeled title="Новий пароль">
        <PasswordInput
          autoComplete="new-password"
          className={styles.field}
          value={password}
          onTextChanged={setPassword}
          error={password.length < 8}
        />
      </Labeled>

      <Labeled title="Повторіть пароль">
        <PasswordInput
          autoComplete="new-password"
          className={styles.field}
          value={repeatPassword}
          onTextChanged={setRepeatPassword}
          error={password !== repeatPassword}
        />
      </Labeled>

      <ErrorBoard
        items={[
          password.length < 8 && 'Пароль має бути 8 символів довжиною',
          password !== repeatPassword && 'Паролі не співпадають',
        ]}
      />

      <Button
        disabed={password.length < 8 || password !== repeatPassword}
        className={styles.action}
        buttonVariant="solid"
        onClick={() => {
          resetPassword({ token, newPassword: password })
            .then(() => {
              return navigate('/sign?mode=signin');
            })
            .catch((error: unknown) => {
              if (
                error instanceof ApiError &&
                error.code === ApiErrorCode.TOKEN_EXPIRED
              ) {
                notification.show('Недійсне посилання', 'error');
              } else {
                notification.show('Сталася помилка', 'error');
              }
            });
        }}
      >
        Продовжити
      </Button>
    </div>
  );
}
