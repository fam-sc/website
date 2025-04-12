export function joinArray<T>(
  values: T[],
  delimiterFactory: (index: number) => T
): T[] {
  const result: T[] = [];

  for (let i = 0; i < values.length; i++) {
    result.push(values[i]);

    if (i < values.length - 1) {
      result.push(delimiterFactory(i));
    }
  }

  return result;
}
