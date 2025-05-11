export function pick<T, K extends keyof T>(value: T, keys: K[]): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};

  for (const key of keys) {
    result[key] = value[key];
  }

  return result as Pick<T, K>;
}
