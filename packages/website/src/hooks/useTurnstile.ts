import { RefObject, useCallback, useMemo, useRef, useState } from 'react';

import { TurnstileWidgetRefType } from '@/components/TurnstileWidget';

type ReturnType = [
  string | null,
  () => void,
  {
    ref: RefObject<TurnstileWidgetRefType | null>;
    onSuccess: (token: string) => void;
  },
];

export function useTurnstile(): ReturnType {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetRefType>(null);

  const refresh = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.refresh();
  }, []);

  const configuration = useMemo(
    () => ({
      ref: turnstileRef,
      onSuccess: (token: string) => {
        setTurnstileToken(token);
      },
    }),
    []
  );

  return [turnstileToken, refresh, configuration];
}
