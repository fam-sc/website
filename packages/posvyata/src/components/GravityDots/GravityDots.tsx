import { useCallback, useEffect, useRef } from 'react';

import { useSize } from '@/hooks/useSize';
import { Point } from '@/utils/math';

import { renderDots } from './renderer';

export interface GravityDotsProps {
  className?: string;
}

export function GravityDots({ className }: GravityDotsProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const pointerRef = useRef<Point>(null);
  const size = useSize(ref);

  const render = useCallback(() => {
    const context = contextRef.current;

    if (context) {
      renderDots(context, size, pointerRef.current ?? { x: 0, y: 0 });
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
      const listener = (event: PointerEvent) => {
        pointerRef.current = { x: event.clientX, y: event.clientY };

        render();
      };

      canvas.addEventListener('pointermove', listener, { passive: true });

      return () => {
        canvas.removeEventListener('pointermove', listener);
      };
    }
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  return <canvas ref={ref} className={className} {...size} />;
}
