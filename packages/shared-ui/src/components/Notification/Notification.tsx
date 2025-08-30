import { classNames } from '@sc-fam/shared';
import { createContext, FC, ReactNode, useMemo, useState } from 'react';

import { contextUseFactory } from '../../utils/contextFactory';
import styles from './Notification.module.scss';

type Typography = FC<{ children: ReactNode }>;

export type NotificationType = 'plain' | 'error';

export type NotificationProps = {
  typography?: Typography;
  message: string;
  type: NotificationType;
  isVisible: boolean;
};

export type NotificationWrapperProps = {
  typography?: Typography;
  children: ReactNode;
};

export type NotificationManager = {
  show(message: string, type: NotificationType): void;
};

export const NotificationContext = createContext<NotificationManager | null>(
  null
);

export function Notification({
  typography,
  message,
  type,
  isVisible,
}: NotificationProps) {
  const Typography = typography ?? 'p';

  return (
    <div
      className={classNames(
        styles.root,
        !isVisible && styles['root-invisible']
      )}
      role="alert"
    >
      <Typography className={styles[`text-type-${type}`]}>{message}</Typography>
    </div>
  );
}

export function NotificationWrapper({
  typography,
  children,
}: NotificationWrapperProps) {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  }>();

  const manager = useMemo(
    (): NotificationManager => ({
      show: (message, type) => {
        setVisible(true);
        setNotification({ message, type });

        setTimeout(() => {
          setVisible(false);

          // Let the animation run for 250 ms
          setTimeout(() => {
            setNotification(undefined);
          }, 250);
        }, 3000);
      },
    }),
    []
  );

  return (
    <NotificationContext.Provider value={manager}>
      {children}
      {notification && (
        <Notification
          isVisible={isVisible}
          typography={typography}
          {...notification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = contextUseFactory(
  NotificationContext,
  'NotificationContext'
);
