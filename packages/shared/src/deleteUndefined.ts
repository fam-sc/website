export function deleteUndefined<T>(value: T): Partial<T> {
  const result = { ...value };

  for (const key in value) {
    if (value[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete result[key];
    }
  }

  return result;
}
