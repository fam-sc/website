import { useEffect } from 'react';

export function useInterval(
  delay: number,
  block: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (enabled) {
      const id = setInterval(block, delay);

      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, enabled]);
}
