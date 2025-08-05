import { AccessInfo } from '@sc-fam/shared/api/google';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { GsiScript } from '@/components/GsiScript';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { ModalDialog } from '@/components/ModalDialog';
import { Typography } from '@/components/Typography';

// type StepName = 'auth' | 'auth-pending' | 'export';
type Step = {
  action: string;
  actionEnabled?: boolean;
  component: () => ReactNode;
};

type StepMap = Record<string, Step>;

const steps = {
  auth: {
    action: 'Надати доступ',
    actionEnabled: true,
    component: () => (
      <Typography>
        Необхідно надати доступ до Google Calendar, щоб продовжити
      </Typography>
    ),
  },
  authInProgress: {
    action: 'Надати доступ',
    actionEnabled: false,
    component: () => <IndeterminateCircularProgress />,
  },
  export: {
    action: 'Експротувати',
    actionEnabled: true,
    component: () => <Typography>Test</Typography>,
  },
  error: {
    action: 'Повторити',
    actionEnabled: true,
    component: () => <Typography>Сталася помилка. Спробуйте ще раз</Typography>,
  },
} satisfies StepMap;

type StepName = keyof typeof steps;

function runTokenFlow(callback: (response: GoogleOAuth2TokenResponse) => void) {
  if (import.meta.env.VITE_HOST === 'cf') {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar',
      callback,
    });

    client.requestAccessToken();
  } else {
    // Mock tokens in dev mode
    setTimeout(() => {
      callback({
        access_token: '',
        expires_in: 0,
        scope: 'https://www.googleapis.com/auth/calendar',
        token_type: 'Bearer',
      });
    }, 1000);
  }
}

export default function Page() {
  const [stepName, setStepName] = useState<StepName>('auth');
  const accessInfo = useRef<AccessInfo | null>(null);

  const { action, actionEnabled, component: Component } = steps[stepName];

  const onActionClick = useCallback(() => {
    if (stepName === 'auth') {
      runTokenFlow(({ access_token, token_type }) => {
        accessInfo.current = { token: access_token, type: token_type };
        setStepName('export');
      });

      setStepName('authInProgress');
    } else if (stepName === 'export') {
    }
  }, [stepName]);

  return (
    <>
      <GsiScript />
      <ModalDialog
        effect="blur"
        footer={
          <Button disabled={!actionEnabled} onClick={onActionClick}>
            {action}
          </Button>
        }
      >
        <Component />
      </ModalDialog>
    </>
  );
}
