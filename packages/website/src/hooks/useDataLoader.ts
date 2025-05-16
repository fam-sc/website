import {
  DependencyList,
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type DataState<T> = { value: T } | 'pending' | 'error';

type ResultArray<T> = [DataState<T>, () => void, Dispatch<T>];

export function useDataLoader<T>(
  loader: () => Promise<T>,
  deps: DependencyList
): ResultArray<T> {
  const [state, setState] = useState<DataState<T>>('pending');

  const setResult = useCallback(
    (value: T) => {
      setState({ value });
    },
    [setState]
  );

  const doLoad = useCallback(() => {
    setState('pending');

    loader()
      .then((value) => {
        setState({ value });
      })
      .catch((error: unknown) => {
        console.error(error);

        setState('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    doLoad();
  }, [doLoad]);

  return useMemo(() => [state, doLoad, setResult], [state, doLoad, setResult]);
}
