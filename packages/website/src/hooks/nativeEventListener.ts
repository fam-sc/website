// A helper for useEffect to simplify this pattern.
// useEffect(() => {
//   const listener = () => {};
//
//   target.addEventListener(name, listener);
//   return () => target.removeEventListener(name, listener);
// });
export function addNativeEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  key: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
): () => void {
  target.addEventListener(key, listener);

  return () => {
    target.removeEventListener(key, listener);
  };
}
