export function convertToKeyMap<T, K extends keyof T>(
  values: T[],
  key: K
): Map<T[K], T> {
  const result = new Map<T[K], T>();

  for (const item of values) {
    result.set(item[key], item);
  }

  return result;
}
