import {
  ComponentProps,
  RefObject,
  useEffect,
  useId,
  useImperativeHandle,
} from 'react';

import { Turnstile } from '@/api/turnstile/client';

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export type TurnstileWidgetRefType = {
  refresh: () => void;
};

export interface TurnstileWidgetProps
  extends Omit<ComponentProps<'div'>, 'id' | 'ref'> {
  ref?: RefObject<TurnstileWidgetRefType | null>;
  onSuccess: (token: string) => void;
}

export function TurnstileWidget({
  ref,
  onSuccess,
  ...rest
}: TurnstileWidgetProps) {
  const id = useId();
  const selector = `#${id}`;

  useImperativeHandle(ref, () => ({
    refresh: () => {
      window.turnstile.reset(selector);
    },
  }));

  useEffect(() => {
    const { turnstile } = window;

    turnstile.ready(() => {
      turnstile.render(selector, {
        sitekey: import.meta.env.VITE_CF_TURNSTILE_SITEKEY,
        size: 'normal',
        theme: 'dark',
        language: 'uk-ua',
        callback: onSuccess,
      });
    });

    return () => {
      try {
        turnstile.remove(selector);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={id} {...rest} />;
}
