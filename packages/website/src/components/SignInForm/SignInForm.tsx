import { emailRegex } from '@shared/string/regex';
import { ReactNode, useState } from 'react';

import { signIn } from '@/api/users/client';
import { Button } from '@/components/Button';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInput } from '@/components/TextInput';
import { Typography } from '@/components/Typography';
import { useTestRegex } from '@/hooks/useTestRegex';
import { useTurnstile } from '@/hooks/useTurnstile';

import { Labeled } from '../Labeled';
import { Link } from '../Link';
import { useNotification } from '../Notification';
import { TurnstileWidget } from '../TurnstileWidget';
import styles from './SignInForm.module.scss';

function InputGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Labeled
      title={title}
      titleVariant="bodyLarge"
      className={styles['input-group']}
    >
      {children}
    </Labeled>
  );
}

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, refreshTurnstile, turnstile] = useTurnstile();

  const isEmailValid = useTestRegex(email, emailRegex);

  const notification = useNotification();

  const handleSubmit = () => {
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

        refreshTurnstile();
      });
  };

  return (
    <div className={styles.root}>
      <Typography as="strong" variant="h4" className={styles.title}>
        З Поверненням!
      </Typography>

      <InputGroup title="Пошта">
        <TextInput
          value={email}
          onTextChanged={setEmail}
          error={!isEmailValid}
        />
      </InputGroup>

      <InputGroup title="Пароль">
        <PasswordInput value={password} onTextChanged={setPassword} />
      </InputGroup>

      <Link to="/forgot-password">Забули пароль?</Link>

      {import.meta.env.VITE_HOST === 'cf' && (
        <TurnstileWidget
          className={styles['turnstile-widget']}
          {...turnstile}
        />
      )}

      <Button
        onClick={handleSubmit}
        buttonVariant="solid"
        disabled={
          !isEmailValid ||
          password.length === 0 ||
          (import.meta.env.VITE_HOST === 'cf' && turnstileToken === null)
        }
      >
        Увійти
      </Button>
    </div>
  );
}
