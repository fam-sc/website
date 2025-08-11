import { useEffect, useRef, useState } from 'react';

import { useSize } from '@/hooks/useSize';
import { useTickAnimation } from '@/hooks/useTickAnimation';
import { classNames } from '@/utils/classNames';
import { measureTextWidth } from '@/utils/measureText';

import { Typography, TypographyProps } from '../Typography';
import styles from './PixelUnderlineButton.module.scss';

export interface PixelUnderlineButtonProps extends TypographyProps {
  className?: string;
  children: string;
}

const DURATION = 500;

export function PixelUnderlineButton({
  className,
  children,
  ...rest
}: PixelUnderlineButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const [isOver, setOver] = useState(false);

  const underlineRef = useRef<HTMLParagraphElement>(null);
  const tickLengthRef = useRef(15);
  const tickCountRef = useRef(0);

  const animator = useTickAnimation();

  const size = useSize(ref);

  useEffect(() => {
    tickLengthRef.current = measureTextWidth('_', `1.5em "Press Start"`);
  }, []);

  useEffect(() => {
    const underline = underlineRef.current;

    if (underline) {
      if (isOver) {
        const totalTickCount = Math.floor(
          size.width / (tickLengthRef.current * 1.5)
        );

        animator.start(DURATION, (elapsed) => {
          const tickCount = Math.floor((elapsed / DURATION) * totalTickCount);

          tickCountRef.current = tickCount;

          underline.textContent = '_'.repeat(tickCount);
        });
      } else {
        animator.stop();
        underline.textContent = '';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  return (
    <Typography
      as="button"
      ref={ref}
      font="press-start"
      className={classNames(styles.root, className)}
      onMouseOver={() => {
        setOver(true);
      }}
      onMouseLeave={() => {
        setOver(false);
      }}
      {...rest}
    >
      {children}

      <p className={styles.underline} ref={underlineRef} />
    </Typography>
  );
}
