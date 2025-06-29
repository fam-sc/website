import { useEffect, useId } from 'react';

import { Turnstile } from '@/api/turnstile/client';
import { PropsMap } from '@/types/react';

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export interface TurnstileWidgetProps extends Omit<PropsMap['div'], 'id'> {
  onSuccess: (token: string) => void;
}

export function TurnstileWidget({ onSuccess, ...rest }: TurnstileWidgetProps) {
  const id = useId();

  useEffect(() => {
    // eslint-disable-next-line unicorn/prefer-global-this
    const { turnstile } = window;

    turnstile.ready(() => {
      turnstile.render(`#${id}`, {
        sitekey: import.meta.env.VITE_CF_TURNSTILE_SITEKEY,
        size: 'normal',
        theme: 'dark',
        language: 'uk-ua',
        callback: onSuccess,
      });
    });

    return () => {
      try {
        turnstile.reset(`#${id}`);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={id} {...rest} />;
}
