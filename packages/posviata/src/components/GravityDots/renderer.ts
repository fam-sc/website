import { Size } from '@/hooks/useSize';
import { Point } from '@/utils/math';

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

  const dotSize = Math.max(2, size.width / 400);

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

        const pull = Math.min(20, 60_000 / (distance * distance));

        dotX = x + pull * (dx / distance);
        dotY = y + pull * (dy / distance);
      }

      context.fillRect(dotX, dotY, dotSize, dotSize);
    }
  }
}

function renderRow(
  context: CanvasRenderingContext2D,
  width: number,
  dotSize: number,
  y: number
) {
  const xStep = width / X_DOTS;

  for (let i = 1; i < X_DOTS; i += 1) {
    const x = i * xStep;

    context.fillRect(x, y, dotSize, dotSize);
  }
}

function renderColumn(
  context: CanvasRenderingContext2D,
  height: number,
  dotSize: number,
  x: number
) {
  const yStep = height / X_DOTS;

  for (let i = 1; i < X_DOTS; i += 1) {
    const y = i * yStep;

    context.fillRect(x, y, dotSize, dotSize);
  }
}

export function renderDotsOnBorder(
  context: CanvasRenderingContext2D,
  size: Size
) {
  const { width, height } = size;

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#ffffff';

  const xStep = width / X_DOTS;
  const yStep = height / Y_DOTS;

  const dotSize = Math.max(2, width / 400);

  renderRow(context, width, dotSize, yStep);
  renderRow(context, width, dotSize, height - yStep);

  renderColumn(context, height, dotSize, xStep);
  renderColumn(context, height, dotSize, width - xStep);
}
