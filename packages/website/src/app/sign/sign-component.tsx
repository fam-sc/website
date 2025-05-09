'use client';

import { useState } from 'react';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import styles from './page.module.scss';


export function SignComponent() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.leftSide}>
        {isSignIn ? (
          <>
            <Typography variant="h4">Ще не з нами?</Typography>
            <Button buttonVariant="outlined" onClick={() => setIsSignIn(false)}>
              Зареєструватись
            </Button>
          </>
        ) : (
          <>
            <SignUpForm />
          </>
        )}
      </div>

      <div className={styles.divider}></div>

      <div className={styles.rightSide}>
        {isSignIn ? (
          <>
            <SignInForm />
          </>
        ) : (
          <>
            <Typography variant="h6">Вже маєте обліковий запис?</Typography>
            <Button  buttonVariant="outlined" onClick={() => setIsSignIn(true)}>
              Увійти
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
