const X_COUNT = 10;
const Y_COUNT = 10;

export type Point = { x: number; y: number };

export function gridMapSymbol(
  context: CanvasRenderingContext2D,
  path: Path2D,
  width: number,
  height: number
) {
  const stepX = width / X_COUNT;
  const stepY = height / Y_COUNT;

  const points: Point[] = [];

  for (let x = 0; x < width; x += stepX) {
    for (let y = 0; y < height; x += stepY) {
      if (context.isPointInPath(path, x, y)) {
        points.push({ x, y });
      }
    }
  }

  return points;
}
