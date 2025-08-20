import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { addNativeEventListener } from '@/hooks/nativeEventListener';
import { useSize } from '@/hooks/useSize';
import { Point } from '@/utils/math';

import { renderDots, renderDotsOnBorder } from './renderer';

export interface GravityDotsProps {
  className?: string;
  minimal?: boolean;
}

export function GravityDots({ className, minimal = false }: GravityDotsProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const pointerRef = useRef<Point | null>(null);
  const initialSize = useSize(ref);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(window.devicePixelRatio);
  }, []);

  const size = useMemo(
    () => ({
      width: initialSize.width * scale,
      height: initialSize.height * scale,
    }),
    [initialSize, scale]
  );

  const render = useCallback(() => {
    const context = contextRef.current;

    if (context) {
      if (minimal) {
        renderDotsOnBorder(context, size);
      } else {
        renderDots(context, size, pointerRef.current);
      }
    }
  }, [size, minimal]);

  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context === null) {
        throw new Error('No context');
      }

      contextRef.current = context;
    }
  }, []);

  useEffect(() => {
    const canvas = ref.current;

    if (canvas && !minimal) {
      return addNativeEventListener(
        canvas,
        'pointermove',
        (event) => {
          let pointer = pointerRef.current;
          if (pointer == null) {
            pointer = { x: 0, y: 0 };
            pointerRef.current = pointer;
          }

          pointer.x = event.offsetX * scale;
          pointer.y = event.offsetY * scale;

          render();
        },
        { passive: true }
      );
    }
  }, [render, scale, minimal]);

  useEffect(render, [render]);

  return (
    <canvas
      ref={ref}
      className={className}
      onMouseOut={() => {
        pointerRef.current = null;

        render();
      }}
      {...size}
    />
  );
}
