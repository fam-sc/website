import { useNotification } from '@/components/Notification';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

type ResultArray<T> = [T, boolean, Dispatch<SetStateAction<T>>];

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps?: unknown[]
): ResultArray<T | undefined>;

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: unknown[],
  initial: T
): ResultArray<T>;

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: unknown[] | undefined,
  initial?: T
): [T | undefined, boolean, Dispatch<SetStateAction<T | undefined>>] {
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
