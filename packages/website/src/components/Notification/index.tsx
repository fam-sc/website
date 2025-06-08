

import { Typography } from '../Typography';

import styles from './index.module.scss';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type NotificationType = 'plain' | 'error';

export type NotificationProps = {
  message: string;
  type: NotificationType;
  isVisible: boolean;
};

export type NotificationWrapperProps = {
  children: ReactNode;
};

export type NotificationManager = {
  show(message: string, type: NotificationType): void;
};

export const NotificationContext = createContext<
  NotificationManager | undefined
>(undefined);

export function Notification({ message, type, isVisible }: NotificationProps) {
  return (
    <div className={styles.root} data-visible={isVisible} role="alert">
      <Typography data-type={type}>{message}</Typography>
    </div>
  );
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
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
      {notification && <Notification isVisible={isVisible} {...notification} />}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationManager {
  const value = useContext(NotificationContext);
  if (value === undefined) {
    throw new Error('No ErrorAlertContext in the tree');
  }

  return value;
}
