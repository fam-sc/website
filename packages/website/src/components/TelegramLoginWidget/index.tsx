/* eslint-disable unicorn/prefer-dom-node-dataset */


import { useEffect, useRef } from 'react';

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: string;
  hash: string;
};

// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
declare module globalThis {
  let _onTelegramAuth: ((user: User) => void) | undefined;
}

export type TelegramLoginWidgetProps = {
  bot: string;
  onCallback: (user: User) => void;
};

export function TelegramLoginWidget({
  bot,
  onCallback,
}: TelegramLoginWidgetProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current: root } = rootRef;
    if (root !== null) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';

      script.setAttribute('data-telegram-login', bot);
      script.setAttribute('data-request-access', 'write');

      script.dataset.size = 'large';
      script.dataset.onauth = '_onTelegramAuth(user)';

      root.replaceChildren(script);

      return () => {
        script.remove();
      };
    }
  }, [bot]);

  useEffect(() => {
    globalThis._onTelegramAuth = onCallback;
  }, [onCallback]);

  return <div ref={rootRef}></div>;
}
