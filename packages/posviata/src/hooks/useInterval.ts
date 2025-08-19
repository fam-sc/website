import { useEffect } from 'react';

export function useInterval(delay: number, block: () => void) {
  useEffect(() => {
    const id = setInterval(block, delay);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
