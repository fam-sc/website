import { useEffect, useState } from 'react';

import { addNativeEventListener } from './nativeEventListener';

export function useMediaQuery(
  input: string,
  fallback: boolean = false
): boolean {
  const [state, setState] = useState(fallback);

  useEffect(() => {
    const query = window.matchMedia(input);

    setState(query.matches);

    return addNativeEventListener(query, 'change', (event) => {
      setState(event.matches);
    });
  }, [input]);

  return state;
}
