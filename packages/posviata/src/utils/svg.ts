export type Point = [number, number];

const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
};

const controlPoint = (
  current: Point,
  previous: Point | undefined,
  next: Point | undefined,
  reverse?: boolean
): Point => {
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.15;
  const o = line(p, n);
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;

  return [x, y];
};

function formatPoint([x, y]: Point) {
  return `${x.toPrecision(3)}, ${y.toPrecision(3)} `;
}

export function buildSvgPlot(data: Point[]) {
  data = data.map((item) => [item[0] * 500, item[1] * 150]);

  let svgPath = '';
  let startCP: Point = [0, 0];
  let endCP: Point = [0, 0];

  for (const [i, dot] of data.entries()) {
    if (i !== 0) {
      startCP = controlPoint(data[i - 1], data[i - 2], dot);
      endCP = controlPoint(dot, data[i - 1], data[i + 1], true);
    }

    svgPath += i === 0 ? 'M ' : 'C ';
    svgPath +=
      i === 0
        ? formatPoint(dot)
        : `${formatPoint(startCP)}${formatPoint(endCP)}${formatPoint(dot)}`;
  }

  return svgPath;
}
