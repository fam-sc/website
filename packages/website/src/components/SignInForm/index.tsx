import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Typography } from '@/components/Typography';
import { Link } from '../Link';
import styles from './index.module.scss';
import { signIn } from '@/api/users/client';
import { useNotification } from '../Notification';
import { TurnstileWidget } from '../TurnstileWidget';
import { emailRegex } from '@shared/string/regex';
import { useTestRegex } from '@/hooks/useTestRegex';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>();

  const isEmailValid = useTestRegex(email, emailRegex);

  const notification = useNotification();

  const handleSubmit = () => {
    if (turnstileToken !== undefined) {
      signIn({
        email,
        password,
        turnstileToken,
      })
        .then(() => {
          // Don't use client navigation, because the auth status changed and
          // we need to refresh the root layout
          globalThis.location.href = '/u/info';
        })
        .catch(() => {
          notification.show('Неправильний email або пароль', 'error');
        });
    }
  };

  return (
    <div className={styles.signinForm}>
      <div className={styles.formTitle}>
        <Typography as="strong" variant="h4" className="formTitle">
          З Поверненням!
        </Typography>
      </div>
      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пошта
        </Typography>
        <TextInput
          value={email}
          onTextChanged={setEmail}
          error={!isEmailValid}
        />
      </div>

      <div className={styles.formGroup}>
        <Typography as="label" variant="bodyLarge">
          Пароль
        </Typography>
        <PasswordInput value={password} onTextChanged={setPassword} />
      </div>

      <div className={styles.formGroup}>
        <Link to="/forgot-password">Забули пароль?</Link>
      </div>

      {import.meta.env.VITE_HOST === 'cf' && (
        <TurnstileWidget
          className={styles['turnstile-widget']}
          onSuccess={setTurnstileToken}
        />
      )}

      <div className={styles.formGroup}>
        <Button
          onClick={handleSubmit}
          buttonVariant="solid"
          disabled={
            !(
              isEmailValid &&
              password.length > 0 &&
              turnstileToken !== undefined
            )
          }
        >
          Увійти
        </Button>
      </div>
    </div>
  );
}
