export function isErrorWithCode(value: unknown, target: number): boolean {
  return (value as { code: number } | undefined)?.code === target;
}
