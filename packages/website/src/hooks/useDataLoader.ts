import { useNotification } from '@/components/Notification';
import { useEffect, useMemo, useState } from 'react';

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps?: unknown[]
): [T | undefined, boolean, (value: T) => void];

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: unknown[],
  initial: T
): [T, boolean, (value: T) => void];

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: unknown[] | undefined,
  initial?: T
): [T | undefined, boolean, (value: T) => void] {
  const notification = useNotification();
  const [result, setResult] = useState<T | undefined>(initial);
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    setPending(true);

    loader()
      .then((result) => {
        setPending(false);

        setResult(result);
      })
      .catch((error: unknown) => {
        setPending(false);

        notification.show('Сталася помилка при завантаженні даних', 'error');
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useMemo(
    () => [result, isPending, setResult],
    [result, isPending, setResult]
  );
}
