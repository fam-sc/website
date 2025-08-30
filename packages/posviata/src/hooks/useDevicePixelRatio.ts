import { useEffect, useState } from 'react';

import { addNativeEventListener } from './nativeEventListener';

export function useDevicePixelRatio(): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(resolution: ${scale}dppx)`);

    return addNativeEventListener(media, 'change', () => {
      setScale(window.devicePixelRatio);
    });
  }, [scale]);

  return scale;
}
