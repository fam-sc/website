import { LinkButton } from '@/components/LinkButton';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export interface SignPageProps {
  mode: 'signin' | 'signup';
}

export function SignPage({ mode }: SignPageProps) {
  const isSignIn = mode == 'signin';

  return (
    <div className={styles.authWrapper}>
      <Title>{isSignIn ? 'Увійти' : 'Зареєструватися'}</Title>

      <div className={styles.leftSide}>
        {isSignIn ? (
          <>
            <Typography as="strong" variant="h4">
              Ще не з нами?
            </Typography>

            <LinkButton buttonVariant="outlined" to="/signup">
              Зареєструватись
            </LinkButton>
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

            <LinkButton buttonVariant="outlined" to="/signin">
              Увійти
            </LinkButton>
          </>
        )}
      </div>
    </div>
  );
}
