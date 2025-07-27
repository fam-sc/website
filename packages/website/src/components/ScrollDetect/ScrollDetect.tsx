import { createDebouncer } from '@sc-fam/shared';
import React, { ReactElement, Ref, useLayoutEffect, useRef } from 'react';

import { addNativeEventListener } from '@/hooks/nativeEventListener';

export interface ScrollDetectProps {
  onScrollEnd: (target: Event) => void;
  children: ReactElement<{ ref?: Ref<HTMLElement | null> }>;
}

export function ScrollDetect({ onScrollEnd, children }: ScrollDetectProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element !== null) {
      if ('onscrollend' in element) {
        return addNativeEventListener(element, 'scrollend', onScrollEnd, {
          passive: true,
        });
      } else {
        const debouncer = createDebouncer(onScrollEnd);

        return addNativeEventListener(element, 'scroll', debouncer.run, {
          passive: true,
        });
      }
    }
  }, [onScrollEnd]);

  return React.cloneElement(children, { ref });
}
