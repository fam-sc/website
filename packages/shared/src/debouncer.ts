export function createDebouncer<Args extends unknown[]>(
  callback: (...args: Args) => void
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return {
    run: (...args: Args) => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(callback, 100, ...args);
    },
  };
}
