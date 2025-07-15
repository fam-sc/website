/* eslint-disable unicorn/prefer-dom-node-dataset */

import { TelegramBotAuthPayload } from '@shared/api/telegram/auth';
import { useEffect, useId, useRef } from 'react';

type CallbackType = (user: TelegramBotAuthPayload) => void;

const CALLBACK_PREFIX = '__onTelegramAuth';

declare global {
  type CallbackMap = Record<
    `${typeof CALLBACK_PREFIX}${string}`,
    CallbackType | undefined
  >;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends CallbackMap {}
}

export type TelegramLoginWidgetProps = {
  bot: string;
  onCallback: CallbackType;
};

export function TelegramLoginWidget({
  bot,
  onCallback,
}: TelegramLoginWidgetProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If to use <script> as a React element, then the React will pull it to the <head>, which is unwnated in our case.
    // The Telegram script inserts iframe where the script is located, so the exact location is important.
    const root = rootRef.current;

    if (root !== null) {
      const script = document.createElement('script');

      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';

      script.setAttribute('data-telegram-login', bot);
      script.setAttribute('data-request-access', 'write');

      script.dataset.size = 'large';
      script.dataset.userpic = 'false';
      script.dataset.onauth = `window['onTelegramAuth${id}'](user)`;

      root.replaceChildren(script);

      return () => {
        script.remove();
      };
    }
  }, [bot, id]);

  useEffect(() => {
    const name = `${CALLBACK_PREFIX}${id}` as const;

    window[name] = onCallback;

    return () => {
      // Do not leave the callback referenced. It might capture some objects
      // which would keep them from being GC-ed
      window[name] = undefined;
    };
  }, [id, onCallback]);

  return <div ref={rootRef} />;
}
