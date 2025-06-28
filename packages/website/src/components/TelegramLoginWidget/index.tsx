/* eslint-disable unicorn/prefer-dom-node-dataset */

import { useEffect, useId, useRef } from 'react';

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

type CallbackType = (user: User) => void;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window
    extends Record<`onTelegramAuth${string}`, CallbackType | undefined> {}
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
    // If use script as React element, then it will pull it to the head, which is unwnated in our case.
    // The Telegram script inserts iframe where the script is located, so the exact location is important.
    const { current: root } = rootRef;
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
    const name = `onTelegramAuth${id}` as const;

    window[name] = onCallback;

    return () => {
      window[name] = undefined;
    };
  }, [id, onCallback]);

  return <div ref={rootRef} />;
}
