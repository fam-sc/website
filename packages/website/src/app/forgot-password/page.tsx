import { forgotPassword } from '@/api/users/client';
import { Button } from '@/components/Button';
import { useNotification } from '@/components/Notification';
import { TextInput } from '@/components/TextInput';
import { TurnstileWidget } from '@/components/TurnstileWidget';
import { Typography } from '@/components/Typography';
import { useTestRegex } from '@/hooks/useTestRegex';
import { emailRegex } from '@shared/string/regex';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './page.module.scss';

export default function Page() {
  const [email, setEmail] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isActionInProgress, setActionInProgress] = useState(false);
  const isEmailValid = useTestRegex(email, emailRegex);

  const notification = useNotification();
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <Typography>Введіть e-mail вашого облікового запису:</Typography>

      <TextInput
        error={!isEmailValid}
        autoComplete="email"
        className={styles.email}
        value={email}
        onTextChanged={setEmail}
      />

      {import.meta.env.VITE_HOST === 'cf' && (
        <TurnstileWidget onSuccess={setTurnstileToken} />
      )}

      <Button
        buttonVariant="solid"
        disabled={
          !isEmailValid ||
          (import.meta.env.VITE_HOST === 'cf' && turnstileToken === null) ||
          isActionInProgress
        }
        onClick={() => {
          setActionInProgress(true);

          forgotPassword({ email, turnstileToken })
            .then(() => {
              return navigate('/forgot-password/email');
            })
            .catch(() => {
              setActionInProgress(false);

              notification.show('Сталася помилка', 'error');
            });
        }}
      >
        Продовжити
      </Button>
    </div>
  );
}
