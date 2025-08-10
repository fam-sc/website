import { Size } from '@/hooks/useSize';

import { RenderState, renderText } from './renderer';
import { createSymbol } from './symbol';

// const ANIMATION_DURATION = 2000;

export type AnimatedTextManager = ReturnType<typeof createManager>;

export function createManager() {
  let text: string | undefined;
  const renderState: RenderState = {
    symbols: [],
    scale: 1.5,
    size: { width: 0, height: 0 },
  };
  let context: CanvasRenderingContext2D | undefined;

  function render(animationFraction: number = 1) {
    if (context && renderState.symbols.length > 0) {
      renderText(context, renderState, animationFraction);
    }
  }

  /*
  function startAnimation() {
    let animationStartTime: number | undefined;

    const tick: FrameRequestCallback = (time) => {
      if (animationStartTime == undefined) {
        animationStartTime = time;
      }

      const elapsed = time - animationStartTime;
      if (elapsed < ANIMATION_DURATION) {
        const fraction = elapsed / ANIMATION_DURATION;

        render(fraction);
        requestAnimationFrame(tick);
      } else {
        renderState.animation = undefined;
      }
    };

    requestAnimationFrame(tick);
  }
  */

  return {
    setContext: (value: CanvasRenderingContext2D) => {
      context = value;
    },
    setText: (value: string) => {
      if (text === undefined) {
        const symbols = renderState.symbols;

        for (const char of value) {
          const symbol = createSymbol();
          symbol.setValue(char);

          symbols.push(symbol);
        }
      }

      render();

      /*
      else if (text !== value) {
        renderState.animation = {
          oldText: text,
          indices: differentIndices(text, value),
        };

        startAnimation();
      }
      */

      text = value;
    },
    setSize(size: Size) {
      renderState.size = size;

      render();
    },
  };
}
