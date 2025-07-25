export function isErrorWithCode(
  value: unknown,
  target: number | string
): boolean {
  return (value as { code: number } | undefined)?.code === target;
}
