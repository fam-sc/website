export function lerp(start: number, end: number, fraction: number): number {
  return start + (end - start) * fraction;
}

export function coerce(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
