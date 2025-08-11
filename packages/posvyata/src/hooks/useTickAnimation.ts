import { useEffect, useMemo, useRef } from 'react';

export function useTickAnimation() {
  const isRunningRef = useRef(true);

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
    };
  }, []);

  const animator = useMemo(() => {
    return {
      start: (duration: number, callback: (elapsed: number) => void) => {
        let startTime = -1;

        isRunningRef.current = true;

        const tick: FrameRequestCallback = (time) => {
          if (startTime < 0) {
            startTime = time;
          }

          const elapsed = time - startTime;
          if (isRunningRef.current && elapsed < duration) {
            callback(elapsed);

            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      },
      stop: () => {
        isRunningRef.current = false;
      },
    };
  }, []);

  return animator;
}
