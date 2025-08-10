import { useEffect, useRef, useState } from 'react';

import { useSize } from '@/hooks/useSize';

import { AnimatedTextManager, createManager } from './manager';

export interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manager, setManager] = useState<AnimatedTextManager | null>(null);

  const size = useSize(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context === null) {
        throw new Error('No context');
      }

      const manager = createManager();
      manager.setContext(context);

      setManager(manager);
    }
  }, []);

  useEffect(() => {
    manager?.setText(text);
  }, [text, manager]);

  useEffect(() => {
    manager?.setSize(size);
  }, [manager, size]);

  return <canvas ref={canvasRef} className={className} {...size} />;
}
