'use client';

import { Typography } from '../Typography';

import styles from './index.module.scss';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type ErrorAlertProps = {
  message: string;
};

export type ErrorAlertWrapperProps = {
  children: ReactNode;
};

export type ErrorAlertManager = {
  show(message: string): void;
};

export const ErrorAlertContext = createContext<ErrorAlertManager | undefined>(
  undefined
);

export function ErrorAlert({ message, ...rest }: ErrorAlertProps) {
  return (
    <div className={styles.root} {...rest}>
      <Typography>{message}</Typography>
    </div>
  );
}

export function ErrorAlertWrapper({ children }: ErrorAlertWrapperProps) {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const manager = useMemo(
    (): ErrorAlertManager => ({
      show: (message) => {
        setVisible(true);
        setMessage(message);

        setTimeout(() => {
          setVisible(false);

          // Let the animation run for 250 ms
          setTimeout(() => {
            setMessage(undefined);
          }, 250);
        }, 3000);
      },
    }),
    []
  );

  return (
    <ErrorAlertContext.Provider value={manager}>
      {children}
      {message === undefined ? undefined : (
        <ErrorAlert data-visible={isVisible} message={message} />
      )}
    </ErrorAlertContext.Provider>
  );
}

export function useErrorAlert(): ErrorAlertManager {
  const value = useContext(ErrorAlertContext);
  if (value === undefined) {
    throw new Error('No ErrorAlertContext in the tree');
  }

  return value;
}
