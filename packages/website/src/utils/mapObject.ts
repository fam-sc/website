export function mapObjectToArray<T, R>(
  value: T,
  mapping: (key: keyof T, property: T[keyof T]) => R
): R[] {
  const result: R[] = [];

  for (const key in value) {
    result.push(mapping(key, value[key]));
  }

  return result;
}
