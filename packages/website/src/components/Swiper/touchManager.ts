export type TouchManager = {
  connect(element: HTMLElement): void;
  disconnect(): void;
};

type TouchInfo = {
  x: number;
  y: number;
  time: number;
};

type FullTouchEvent = {
  current: TouchInfo;
  last: TouchInfo;
  initial: TouchInfo;
};

type FullTouchEventHandler = (event: FullTouchEvent) => void;

type TouchManagerOptions = {
  onDown?: FullTouchEventHandler;
  onMove?: FullTouchEventHandler;
  onUp?: FullTouchEventHandler;
  onUpAlways?: () => void;
};

// Angle for a swipe to be valid. Other angles will be rejected
const VALID_SWIPE_ANGLE = Math.PI / 4;

function touchBuffer(n: number) {
  const array: TouchInfo[] = [];
  for (let index = 0; index < n; index += 1) {
    array.push({ x: 0, y: 0, time: 0 });
  }

  return {
    push(x: number, y: number, time: number): void {
      for (let index = 0; index < n - 1; index += 1) {
        Object.assign(array[index + 1], array[index]);
      }

      const [touch] = array;
      touch.x = x;
      touch.y = y;
      touch.time = time;
    },
    reset(x: number, y: number, time: number): void {
      for (const touch of array) {
        touch.x = x;
        touch.y = y;
        touch.time = time;
      }
    },
    get(index: number): TouchInfo {
      return array[index];
    },
  };
}

export function createTouchManager({
  onDown,
  onMove,
  onUp,
  onUpAlways,
}: TouchManagerOptions): TouchManager {
  let connectedElement: HTMLElement | undefined;

  let isDown = false;
  let downPointerId = 0;
  let isSwipe = false;

  const initialTouch: TouchInfo = { x: 0, y: 0, time: 0 };
  const touches = touchBuffer(2);

  const createTouchEvent = (): FullTouchEvent => {
    return {
      current: touches.get(0),
      last: touches.get(1),
      initial: initialTouch,
    };
  };

  const onGenericDown = (event: PointerEvent) => {
    if (!isDown) {
      const { clientX, clientY, pointerId } = event;

      const time = performance.now();

      initialTouch.x = clientX;
      initialTouch.y = clientY;
      initialTouch.time = time;

      touches.reset(clientX, clientY, time);

      onDown?.(createTouchEvent());

      connectedElement?.setPointerCapture(pointerId);
      downPointerId = pointerId;
      isDown = true;
    }
  };

  const onGenericMove = (event: PointerEvent) => {
    const { clientX, clientY, pointerId } = event;

    if (isDown && downPointerId === pointerId) {
      const angle = Math.atan2(
        Math.abs(clientY - initialTouch.y),
        Math.abs(clientX - initialTouch.x)
      );

      if (isSwipe || angle < VALID_SWIPE_ANGLE) {
        isSwipe = true;

        const time = performance.now();
        touches.push(clientX, clientY, time);

        onMove?.(createTouchEvent());

        return true;
      }
    }

    return false;
  };

  const onGenericUp = ({ pointerId }: PointerEvent) => {
    if (downPointerId === pointerId) {
      if (isSwipe) {
        onUp?.(createTouchEvent());
      }

      isDown = false;
      isSwipe = false;
    }

    onUpAlways?.();
  };

  return {
    connect(element) {
      connectedElement = element;

      const options = { passive: true };
      element.addEventListener('pointerdown', onGenericDown, options);
      element.addEventListener('pointermove', onGenericMove, options);
      element.addEventListener('pointerup', onGenericUp, options);
      element.addEventListener('pointercancel', onGenericUp, options);
    },
    disconnect() {
      const element = connectedElement;

      if (element !== undefined) {
        element.removeEventListener('pointerdown', onGenericDown);
        element.removeEventListener('pointermove', onGenericMove);
        element.removeEventListener('pointerup', onGenericUp);
        element.removeEventListener('pointercancel', onGenericUp);
      }
    },
  };
}
