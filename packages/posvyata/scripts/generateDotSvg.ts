import range from 'lodash/range';

const SIZE = 100;
const DOT_RADIUS = 2;
const X_DOTS = 20;
const Y_DOTS = 20;

function intersperse<T>(values: T[], delimiter: (index: number) => T) {
  return values.flatMap((a, i) => (i ? [delimiter(i), a] : [a]));
}

function generateRow() {
  return intersperse(
    range(X_DOTS).map(() => {
      return `l ${DOT_RADIUS} 0 l 0 ${DOT_RADIUS} l -${DOT_RADIUS} 0 z`;
    }),
    () => `m ${SIZE / X_DOTS} 0`
  ).join(' ');
}

function main() {
  const result = intersperse(
    range(Y_DOTS).map(() => generateRow()),
    (i) => `M 0 ${(SIZE / Y_DOTS) * i}`
  ).join(' ');

  console.log(result);
}

main();
