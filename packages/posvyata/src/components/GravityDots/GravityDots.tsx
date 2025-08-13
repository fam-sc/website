import { useCallback, useEffect, useRef } from 'react';

import { addNativeEventListener } from '@/hooks/nativeEventListener';
import { useSize } from '@/hooks/useSize';
import { Point } from '@/utils/math';

import { renderDots } from './renderer';

export interface GravityDotsProps {
  className?: string;
}

export function GravityDots({ className }: GravityDotsProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const pointerRef = useRef<Point | null>(null);
  const size = useSize(ref);

  const render = useCallback(() => {
    const context = contextRef.current;

    if (context) {
      renderDots(context, size, pointerRef.current);
    }
  }, [size]);

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

    if (canvas) {
      return addNativeEventListener(
        canvas,
        'pointermove',
        (event) => {
          let pointer = pointerRef.current;
          if (pointer == null) {
            pointer = { x: 0, y: 0 };
            pointerRef.current = pointer;
          }

          pointer.x = event.offsetX;
          pointer.y = event.offsetY;

          render();
        },
        { passive: true }
      );
    }
  }, [render]);

  useEffect(render, [render]);

  return <canvas ref={ref} className={className} {...size} />;
}
