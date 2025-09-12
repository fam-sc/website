import { IndeterminateCircularProgress } from '@sc-fam/shared-ui';
import { useNotification } from '@sc-fam/shared-ui';
import { FC, useCallback, useRef, useState } from 'react';

import {
  exportSchedule,
  getExportScheduleOptions,
} from '@/api/schedule/client';
import { ExportScheduleOptions } from '@/api/schedule/export/options/types';
import { ExportSchedulePayload } from '@/api/schedule/export/types';
import { Button } from '@/components/Button';
import { GsiScript } from '@/components/GsiScript';
import { ModalDialog } from '@/components/ModalDialog';
import { Typography } from '@/components/Typography';

import { ExportScheduleForm } from '../ExportScheduleForm';
import styles from './ExportScheduleDialog.module.scss';

export interface ExportScheduleDialogProps {
  group: string;

  onClose: () => void;
}

type Step = {
  action: string;
  actionEnabled?: boolean;
  component: FC<{
    options?: ExportScheduleOptions;
    onPayloadChanged: (value: ExportSchedulePayload) => void;
  }>;
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
    component: () => (
      <IndeterminateCircularProgress className={styles.progress} />
    ),
  },
  exportInProgress: {
    action: 'Експортувати',
    actionEnabled: false,
    component: () => (
      <IndeterminateCircularProgress className={styles.progress} />
    ),
  },
  export: {
    action: 'Експортувати',
    actionEnabled: true,
    component: ({ options, onPayloadChanged }) => {
      if (options === undefined) {
        throw new TypeError('options is undefined');
      }

      return (
        <ExportScheduleForm
          options={options}
          onPayloadChanged={onPayloadChanged}
        />
      );
    },
  },
  error: {
    action: 'Повторити',
    actionEnabled: true,
    component: () => <Typography>Сталася помилка. Спробуйте ще раз</Typography>,
  },
} satisfies StepMap;

type StepName = keyof typeof steps;

function runTokenFlow(): Promise<GoogleOAuth2TokenResponse> {
  return new Promise((resolve) => {
    const scope =
      'https://www.googleapis.com/auth/calendar.calendarlist https://www.googleapis.com/auth/calendar.app.created';

    if (import.meta.env.VITE_HOST === 'cf') {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope,
        callback: resolve,
      });

      client.requestAccessToken();
    } else {
      // Mock tokens in dev mode
      setTimeout(() => {
        resolve({
          access_token: import.meta.env.VITE_TEST_GOOGLE_TOKEN ?? '',
          expires_in: 0,
          scope,
          token_type: 'Bearer',
        });
      }, 1000);
    }
  });
}

export function ExportScheduleDialog({
  group,
  onClose,
}: ExportScheduleDialogProps) {
  const [stepName, setStepName] = useState<StepName>('auth');
  const [options, setOptions] = useState<ExportScheduleOptions>();

  const payload = useRef<ExportSchedulePayload | null>(null);
  const accessInfo = useRef<string | null>(null);

  const notification = useNotification();

  const { action, actionEnabled, component: Component } = steps[stepName];

  const onActionClick = useCallback(() => {
    switch (stepName) {
      case 'auth': {
        const action = async () => {
          const { access_token, token_type } = await runTokenFlow();
          const access = `${token_type} ${access_token}`;

          const options = await getExportScheduleOptions(group, access);

          accessInfo.current = access;

          setOptions(options);
          setStepName('export');
        };

        action().catch(() => setStepName('error'));
        setStepName('authInProgress');

        break;
      }
      case 'export': {
        const value = payload.current;
        const access = accessInfo.current;
        if (value === null || access === null) {
          throw new TypeError('No payload or access token');
        }

        setStepName('exportInProgress');

        exportSchedule(group, value, access)
          .then(() => {
            notification.show('Розклад успішно експортовано', 'plain');
            onClose();
          })
          .catch(() => {
            setStepName('error');
          });

        break;
      }
      case 'error': {
        setStepName('auth');

        break;
      }
    }
  }, [stepName, group, notification, onClose]);

  const onPayloadChanged = useCallback((value: ExportSchedulePayload) => {
    payload.current = value;
  }, []);

  return (
    <>
      <GsiScript />
      <ModalDialog
        effect="blur"
        onClose={onClose}
        contentClassName={styles.content}
        footer={
          <Button
            disabled={!actionEnabled}
            buttonVariant="solid"
            onClick={onActionClick}
          >
            {action}
          </Button>
        }
      >
        <Component options={options} onPayloadChanged={onPayloadChanged} />
      </ModalDialog>
    </>
  );
}
