import { RefObject, useEffect, useState } from 'react';

export type Size = {
  width: number;
  height: number;
};

export function useSize(ref: RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;

        console.log(width, height);

        setSize({ width, height });
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return size;
}
