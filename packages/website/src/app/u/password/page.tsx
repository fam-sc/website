import { useNotification } from '@sc-fam/shared-ui';
import { useState } from 'react';

import { ApiError } from '@/api/error';
import { ApiErrorCode } from '@/api/errorCodes';
import { changePassword } from '@/api/users/client';
import { Button } from '@/components/Button';
import { ErrorBoard } from '@/components/ErrorBoard';
import { PasswordInput } from '@/components/PasswordInput';
import { Title } from '@/components/Title';

import styles from './page.module.scss';

export default function Page() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const notification = useNotification();

  function doChangePassword() {
    setActionInProgress(true);

    changePassword({ oldPassword, newPassword })
      .then(() => {
        setActionInProgress(false);

        // Reset passwords because old password is no longer valid.
        setOldPassword('');
        setNewPassword('');
        setNewPasswordRepeat('');

        notification.show('Пароль змінений', 'plain');
      })
      .catch((error: unknown) => {
        setActionInProgress(false);

        const message =
          error instanceof ApiError &&
          error.code === ApiErrorCode.INVALID_OLD_PASSWORD
            ? 'Неправильний старий пароль'
            : 'Сталася помилка';

        notification.show(message, 'error');
      });
  }

  return (
    <div className={styles.content}>
      <Title>Зміна паролю</Title>

      <PasswordInput
        disabled={actionInProgress}
        autoComplete="current-password"
        placeholder="Старий пароль"
        value={oldPassword}
        onTextChanged={setOldPassword}
      />
      <PasswordInput
        disabled={actionInProgress}
        autoComplete="new-password"
        placeholder="Новий пароль"
        value={newPassword}
        onTextChanged={setNewPassword}
      />
      <PasswordInput
        disabled={actionInProgress}
        autoComplete="new-password"
        placeholder="Повторіть новий пароль"
        value={newPasswordRepeat}
        onTextChanged={setNewPasswordRepeat}
      />

      <ErrorBoard
        items={[
          newPassword.length < 8 &&
            'Довжина новиго паролю має бути як мінімум 8 символів',
          newPassword !== newPasswordRepeat && 'Паролі не співпадають',
        ]}
      />

      <Button
        disabled={
          newPassword.length < 8 ||
          newPassword !== newPasswordRepeat ||
          actionInProgress
        }
        buttonVariant="solid"
        className={styles.action}
        onClick={doChangePassword}
      >
        Змінити
      </Button>
    </div>
  );
}
