import { symbolData } from '@/typography/data';

export type SymbolElement = ReturnType<typeof createSymbol>;

export function createSymbol() {
  let path = new Path2D();
  let symbolValue: string = '';

  return {
    setValue: (value: string) => {
      symbolValue = value;
      const data = symbolData[value].path;

      path = new Path2D(data);
    },
    getWidth: () => {
      return symbolData[symbolValue].width;
    },
    render: (
      context: CanvasRenderingContext2D,
      animationFraction: number = 1
    ) => {
      if (animationFraction === 1) {
        context.fillStyle = '#fff';
        context.fill(path);
      }
    },
  };
}
