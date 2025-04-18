import { CSSProperties, Key, ReactNode, useEffect, useRef } from 'react';

import { AnimationManager, createAnimationManager } from './animation';
import { createTouchManager } from './touchManager';

import styles from './index.module.scss';

import { coerce, lerp } from '@/utils/math';

export type SwiperProps<T extends { id: Key }> = {
  slides: T[];
  renderSlide: (value: T) => ReactNode;
};

// Must be in sync with css.
const SLIDE_BASE_HEIGHT = 0.78;
const SLIDE_MAX_SCALE = 1 / SLIDE_BASE_HEIGHT;

// deceleration after swipe (in slide/ms^2)
const DECELERATION = 0.000_01;

// Factor by which initial velocity (distance between two last points / time) is multiplied.
const VELOCITY_FACTOR = 1;

function scale(value: number): string {
  return `scale(${value.toFixed(2)})`;
}

export function Swiper<T extends { id: Key }>({
  slides,
  renderSlide,
}: SwiperProps<T>) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const stripWidthRef = useRef(0);
  const velocityRef = useRef(0);

  // Stores index of the selected slide.
  // The index is float to handle the manual swiping.
  const selectedSlideRef = useRef(Math.floor(slides.length / 2));

  const animationManagerRef = useRef<AnimationManager | null>(null);

  // Returns distance between two x-points on the screen converted to slide coordinates.
  function distance(x1: number, x2: number): number {
    return (slides.length * (x1 - x2)) / stripWidthRef.current;
  }

  function setVelocity(value: number) {
    velocityRef.current = value;

    const { current: animationManager } = animationManagerRef;

    if (value > 0) {
      animationManager?.startTicking();
    } else {
      setManualMoveStatus(false);
      animationManager?.stop();
    }
  }

  function setSelectedSlide(value: number) {
    const adjustedValue = coerce(value, 0, slides.length - 1);

    selectedSlideRef.current = adjustedValue;
    const { current: strip } = stripRef;
    const { current: indicator } = indicatorRef;

    if (strip !== null && indicator !== null) {
      const tx =
        (100 / slides.length) * (Math.floor(slides.length / 2) - adjustedValue);

      strip.style.transform = `translateX(${tx.toFixed(2)}%)`;

      const anchorIndex = Math.floor(adjustedValue);
      const nearestIndex = Math.round(adjustedValue);

      const fraction = adjustedValue - anchorIndex;

      for (let i = 0; i < strip.childNodes.length; i++) {
        const slide = strip.childNodes[i] as HTMLElement;
        const indicatorButton = indicator.childNodes[i] as HTMLElement;
        const selected = (nearestIndex === i).toString();

        slide.dataset.selected = selected;
        indicatorButton.dataset.selected = selected;

        switch (i) {
          case anchorIndex: {
            // Scale down current slide.
            slide.style.transform = scale(
              lerp(1, SLIDE_MAX_SCALE, 1 - fraction)
            );
            break;
          }
          case anchorIndex + 1: {
            // Scale up the next slide.
            slide.style.transform = scale(lerp(1, SLIDE_MAX_SCALE, fraction));
            break;
          }
          default: {
            slide.style.transform = scale(1);
          }
        }
      }
    }
  }

  function moveBy(delta: number) {
    setSelectedSlide(selectedSlideRef.current - delta);
  }

  function setManualMoveStatus(value: boolean) {
    // If manual move mode is true, then auto transitions on slides are disabled.
    stripRef.current?.setAttribute('data-manual-move', value.toString());
  }

  useEffect(() => {
    const strip = stripRef.current;
    if (strip !== null) {
      let accelerated = false;

      const touchManager = createTouchManager({
        onDown: () => {
          accelerated = false;

          setManualMoveStatus(true);
          velocityRef.current = 0;
        },
        onMove: ({ current, last }) => {
          const relativeDx = distance(current.x, last.x);

          velocityRef.current = 0;
          moveBy(relativeDx);
        },
        onUp: ({ current, last }) => {
          const dx = distance(current.x, last.x);
          const tx = current.time - last.time;

          if (dx !== 0 && tx !== 0) {
            setVelocity((dx / tx) * VELOCITY_FACTOR);

            accelerated = true;
          }
        },
        onUpAlways: () => {
          if (!accelerated) {
            setManualMoveStatus(false);
          }
        },
      });

      const observer = new ResizeObserver(([entry]) => {
        const [size] = entry.borderBoxSize;

        stripWidthRef.current = size.inlineSize;
      });

      touchManager.connect(strip);
      observer.observe(strip);

      return () => {
        touchManager.disconnect();
        observer.disconnect();
      };
    }
  });

  useEffect(() => {
    const manager = createAnimationManager((delta) => {
      const velocity = velocityRef.current;

      if (velocity !== 0) {
        moveBy(velocity * delta);

        // Decelerate velocity, don't let its absolute value be negative and preserve its sign
        setVelocity(
          Math.max(0, Math.abs(velocity) - delta * DECELERATION) *
            Math.sign(velocity)
        );
      }
    });

    animationManagerRef.current = manager;

    return () => {
      manager.stop();
    };
  });

  return (
    <div className={styles.root}>
      <div
        className={styles.strip}
        ref={stripRef}
        style={{ '--slide-count': slides.length } as CSSProperties}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={styles['slide-wrapper']}
            data-selected={Math.floor(selectedSlideRef.current) === index}
          >
            {renderSlide(slide)}
          </div>
        ))}
      </div>

      <div className={styles.indicator} ref={indicatorRef}>
        {slides.map((_, index) => (
          <button
            key={index}
            data-selected={Math.floor(selectedSlideRef.current) === index}
            onClick={() => {
              setSelectedSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
