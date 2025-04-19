export function splitBy<T>(
  items: T[],
  predicate: (value: T) => boolean
): [T[], T[]] {
  const a: T[] = [];
  const b: T[] = [];

  for (const item of items) {
    const array = predicate(item) ? a : b;

    array.push(item);
  }

  return [a, b];
}
