export function omitProperty<T, K extends keyof T>(
  value: T,
  key: K
): Omit<T, K> {
  const copy = { ...value };
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete copy[key];

  return copy;
}
