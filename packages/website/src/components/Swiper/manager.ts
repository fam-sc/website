import { coerce, lerp } from '@sc-fam/shared';

import { createTouchManager, TouchManager } from './touchManager';

// Must be in sync with css.
const SLIDE_BASE_HEIGHT = 0.78;
const SLIDE_MAX_SCALE = 1 / SLIDE_BASE_HEIGHT;

function scale(value: number): string {
  return `scale(${value.toFixed(3)})`;
}

export class SwiperManager {
  private indicator: HTMLElement | undefined;
  private strip: HTMLElement | undefined;

  // Stores index of the selected slide.
  // The index is float to handle the manual swiping.
  private selectedSlide: number = 0;
  private stripWidth: number = 0;
  private slideCount: number = 0;

  private resizeObserver: ResizeObserver | undefined;
  private touchManager: TouchManager | undefined;

  setSlideCount(value: number) {
    this.slideCount = value;
    this.selectedSlide = Math.floor(value / 2);
  }

  // Returns distance between two x-points on the screen converted to slide coordinates.
  private distance(x1: number, x2: number): number {
    return (this.slideCount * (x1 - x2)) / this.stripWidth;
  }

  private setManualMoveStatus(value: boolean) {
    // If manual move mode is true, then auto transitions on slides are disabled.
    this.strip?.setAttribute('data-manual-move', value.toString());
  }

  setSelectedSlide(value: number) {
    const strip = this.strip;
    const indicator = this.indicator;

    if (strip === undefined || indicator === undefined) {
      throw new Error('Strip or indicator are undefined');
    }

    const slideCount = this.slideCount;
    const adjustedValue = coerce(value, 0, slideCount - 1);

    this.selectedSlide = adjustedValue;

    const tx =
      (100 / slideCount) * (Math.floor(slideCount / 2) - adjustedValue);

    strip.style.transform = `translateX(${tx.toFixed(2)}%)`;

    const anchorIndex = Math.floor(adjustedValue);
    const nearestIndex = Math.round(adjustedValue);

    const fraction = adjustedValue - anchorIndex;

    for (let i = 0; i < strip.childNodes.length; i++) {
      const slide = strip.childNodes[i] as HTMLElement;
      const indicatorButton = indicator.childNodes[i] as HTMLElement;
      const selected = (nearestIndex === i).toString();

      slide.dataset.selected = selected;
      indicatorButton.setAttribute('aria-selected', selected);

      switch (i) {
        case anchorIndex: {
          // Scale down current slide.
          slide.style.transform = scale(lerp(1, SLIDE_MAX_SCALE, 1 - fraction));
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

  moveBy(delta: number) {
    this.setSelectedSlide(this.selectedSlide - delta);
  }

  connect(strip: HTMLElement, indicator: HTMLElement) {
    this.strip = strip;
    this.indicator = indicator;

    this.touchManager = createTouchManager({
      onDown: () => {
        this.setManualMoveStatus(true);
      },
      onMove: ({ current, last }) => {
        const relativeDx = this.distance(current.x, last.x);

        this.moveBy(relativeDx);
      },
      onUpAlways: () => {
        this.setManualMoveStatus(false);
      },
    });

    this.resizeObserver = new ResizeObserver(([entry]) => {
      const [size] = entry.borderBoxSize;

      this.stripWidth = size.inlineSize;
    });

    this.touchManager.connect(strip);
    this.resizeObserver.observe(strip);
  }

  disconnect() {
    this.touchManager?.disconnect();
    this.resizeObserver?.disconnect();
  }
}
