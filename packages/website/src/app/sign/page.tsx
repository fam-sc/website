import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Button } from '@/components/Button';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function SignPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode');

  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');

  return (
    <div className={styles.authWrapper}>
      <Title>{isSignIn ? 'Увійти' : 'Зареєструватися'}</Title>

      <div className={styles.leftSide}>
        {isSignIn ? (
          <>
            <Typography as="strong" variant="h4">
              Ще не з нами?
            </Typography>
            <Button
              buttonVariant="outlined"
              onClick={() => {
                setIsSignIn(false);
              }}
            >
              Зареєструватись
            </Button>
          </>
        ) : (
          <SignUpForm />
        )}
      </div>

      <div className={styles.divider}></div>

      <div className={styles.rightSide}>
        {isSignIn ? (
          <SignInForm />
        ) : (
          <>
            <Typography as="strong" variant="h4">
              Вже маєте обліковий запис?
            </Typography>
            <Button
              buttonVariant="outlined"
              onClick={() => {
                setIsSignIn(true);
              }}
            >
              Увійти
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
