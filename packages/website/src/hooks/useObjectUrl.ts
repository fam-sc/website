import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type UrlType = 'object' | undefined;

export type TypedUrl = {
  url: string;
  type: UrlType;
};

type ReturnArray<T = never> = [
  string | T,
  Dispatch<SetStateAction<TypedUrl | T>>,
];

export function useObjectUrl(initial: string, type?: UrlType): ReturnArray;

export function useObjectUrl(
  initial?: string,
  type?: UrlType
): ReturnArray<undefined>;

export function useObjectUrl(initial?: string, type?: UrlType): unknown {
  const [url, setUrl] = useState<TypedUrl | undefined>(
    initial !== undefined ? { url: initial, type } : undefined
  );

  const setObjectUrl = useCallback(
    (value: SetStateAction<TypedUrl | undefined>) => {
      setUrl((prev) => {
        if (prev && prev.type === 'object') {
          URL.revokeObjectURL(prev.url);
        }

        return typeof value === 'function' ? value(prev) : value;
      });
    },
    [setUrl]
  );

  return useMemo(() => [url?.url, setObjectUrl], [url, setObjectUrl]);
}
