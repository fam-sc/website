export function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof value === 'object' && value !== null && 'then' in value;
}
