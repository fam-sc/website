export type AnimationManager = {
  startTicking(): void;
  stop(): void;
};

export function createAnimationManager(
  callback: (delta: number) => void
): AnimationManager {
  let isRunning = false;
  let frameTime = 0;
  let frameId = 0;

  return {
    startTicking() {
      if (!isRunning) {
        isRunning = true;

        const checkingCallback = (time: number) => {
          if (isRunning) {
            const delta = frameTime === 0 ? 0 : time - frameTime;
            callback(delta);

            frameTime = time;
            frameId = requestAnimationFrame(checkingCallback);
          }
        };

        frameId = requestAnimationFrame(checkingCallback);
      }
    },
    stop() {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }

      isRunning = false;
      frameTime = 0;
      frameId = 0;
    },
  };
}
