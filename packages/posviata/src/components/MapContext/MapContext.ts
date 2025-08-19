import { createContext, useContext } from 'react';

export type MapContextType = {
  inView: boolean;
};

export const MapContext = createContext<MapContextType | null>(null);

export function useMapContext(): MapContextType {
  const result = useContext(MapContext);

  if (result === null) {
    throw new Error('No MapContext in the tree');
  }

  return result;
}
