export type Point = {
  x: number;
  y: number;
};

export function distanceSquared(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return dx * dx + dy * dy;
}
