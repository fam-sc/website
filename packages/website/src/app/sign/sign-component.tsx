'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import styles from './page.module.scss';

export function SignComponent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode');

  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (initialMode === 'signup') {
      setIsSignIn(false);
    } else {
      setIsSignIn(true);
    }
  }, [initialMode]);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.leftSide}>
        {isSignIn ? (
          <>
            <Typography as="strong" variant="h4">Ще не з нами?</Typography>
            <Button buttonVariant="outlined" onClick={() => setIsSignIn(false)}>
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
            <Typography as="strong" variant="h4">Вже маєте обліковий запис?</Typography>
            <Button buttonVariant="outlined" onClick={() => setIsSignIn(true)}>
              Увійти
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
