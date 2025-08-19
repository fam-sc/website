import { Size } from '@/hooks/useSize';
import { Point } from '@/utils/math';

const DOT_RADIUS = 2;
const X_DOTS = 20;
const Y_DOTS = 20;

export function renderDots(
  context: CanvasRenderingContext2D,
  size: Size,
  pointer: Point | null
) {
  const xStep = size.width / X_DOTS;
  const yStep = size.height / Y_DOTS;

  context.clearRect(0, 0, size.width, size.height);
  context.fillStyle = '#ffffff';

  for (let i = 1; i < X_DOTS; i += 1) {
    const x = i * xStep;

    for (let j = 1; j < Y_DOTS; j += 1) {
      const y = j * yStep;

      let dotX = x;
      let dotY = y;

      if (pointer !== null) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);

        const pull = Math.min(20, 600 / distance);

        dotX = x + pull * (dx / distance);
        dotY = y + pull * (dy / distance);
      }

      context.fillRect(dotX, dotY, DOT_RADIUS, DOT_RADIUS);
    }
  }
}
