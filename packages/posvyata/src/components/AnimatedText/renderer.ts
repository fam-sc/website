import { Size } from '@/hooks/useSize';

import { SymbolElement } from './symbol';

export type AnimationState = {
  oldText: string;
  indices: number[];
};

export type RenderState = {
  symbols: SymbolElement[];
  scale: number;
  size: Size;
  animation?: AnimationState;
};

const SPACING = 5;

function sumWidth(
  symbols: SymbolElement[],
  start: number,
  end: number
): number {
  let result = SPACING * (symbols.length - 1);

  for (let i = start; i < end; i += 1) {
    result += symbols[i].getWidth();
  }

  return result;
}

function renderSymbol(
  context: CanvasRenderingContext2D,
  symbol: SymbolElement,
  x: number,
  scale: number,
  fraction: number
) {
  context.scale(scale, scale);
  context.translate(x, 0);

  symbol.render(context, fraction);
  context.resetTransform();
}

function renderGroup(
  context: CanvasRenderingContext2D,
  state: RenderState,
  start: number,
  end: number,
  x: number,
  scale: number,
  animationFraction: number = 1
) {
  const { symbols, animation } = state;
  let lastX = x;

  for (let i = start; i < end; i += 1) {
    const fraction =
      animation && animation.indices.includes(i) ? animationFraction : 1;

    const symbol = symbols[i];

    renderSymbol(context, symbol, lastX, scale, fraction);

    lastX += symbol.getWidth() + SPACING;
  }
}

export function renderText(
  context: CanvasRenderingContext2D,
  state: RenderState,
  animationFraction: number = 1
) {
  const { symbols, size } = state;

  const firstGroupWidth = sumWidth(symbols, 0, 2);
  const midGroupWidth = sumWidth(symbols, 3, 5);
  const lastGroupWidth = sumWidth(symbols, 6, 8);

  const maxGroupWidth = Math.max(
    firstGroupWidth,
    midGroupWidth,
    lastGroupWidth
  );
  const maxExpectedGroupWidth = size.width * 0.2;
  const scale =
    maxExpectedGroupWidth === 0 ? 1 : maxExpectedGroupWidth / maxGroupWidth;

  console.log(scale);

  const scaledWidth = size.width / scale;

  const midGroupX = (scaledWidth - midGroupWidth) * 0.5;
  const lastGroupX = scaledWidth - lastGroupWidth;

  const firstColonX =
    (firstGroupWidth + midGroupX) * 0.5 - symbols[2].getWidth();
  const secondColonX =
    (midGroupX + midGroupWidth + lastGroupX) * 0.5 - symbols[5].getWidth();

  context.clearRect(0, 0, size.width, size.height);

  renderGroup(context, state, 0, 2, 0, scale, animationFraction);
  renderGroup(context, state, 3, 5, midGroupX, scale, animationFraction);
  renderGroup(context, state, 6, 8, lastGroupX, scale, animationFraction);

  renderSymbol(context, symbols[2], firstColonX, scale, animationFraction);
  renderSymbol(context, symbols[5], secondColonX, scale, animationFraction);
}
