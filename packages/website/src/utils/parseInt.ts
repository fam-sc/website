export function parseInt(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const result = Number.parseInt(value);
    if (!Number.isNaN(result)) {
      return result;
    }
  }

  return undefined;
}
