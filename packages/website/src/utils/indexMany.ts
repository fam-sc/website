export function indexMany<T>(values: T[], indices: number[]): T[] {
  const result: T[] = [];

  for (const index of indices) {
    result.push(values[index]);
  }

  return result;
}