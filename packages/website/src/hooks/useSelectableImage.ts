import { useCallback, useState } from 'react';

import { ImageInfo } from '@/utils/image/types';

type InitialValue<T> = T | (() => T);

type ReturnType = [
  ImageInfo[] | string | undefined,
  (file: File | undefined) => void,
];

export function useSelectableImage(
  initialValue: InitialValue<ImageInfo[] | undefined>
): ReturnType {
  const [image, setImage] = useState<ImageInfo[] | string | undefined>(
    initialValue
  );

  const setFileImage = useCallback((file: File | undefined) => {
    setImage((prev) => {
      if (typeof prev === 'string') {
        URL.revokeObjectURL(prev);
      }

      return file && URL.createObjectURL(file);
    });
  }, []);

  return [image, setFileImage];
}
