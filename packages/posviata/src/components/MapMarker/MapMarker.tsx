import { classNames } from '@sc-fam/shared';

import { MapMarkerIcon } from '@/icons/MapMarker';

import { useMapContext } from '../MapContext';
import styles from './MapMarker.module.scss';

export type MapMarkerType = 'target' | 'shelter';
export type MapMarkerPosition = 'top' | 'left';

export interface MapMarkerProps {
  className?: string;
  x: number;
  y: number;
  type: MapMarkerType;
  description: string;
  descriptionPosition?: MapMarkerPosition;
}

function formatFraction(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function MapMarker({
  className,
  x,
  y,
  type,
  description,
  descriptionPosition = 'top',
}: MapMarkerProps) {
  const { inView } = useMapContext();

  return (
    <div
      className={classNames(
        styles.root,
        styles[`root-type-${type}`],
        inView && styles[`root-in-view`],
        className
      )}
      style={{ left: formatFraction(x), bottom: formatFraction(y) }}
    >
      <MapMarkerIcon className={styles.icon} />

      <p
        className={classNames(
          styles.description,
          styles[`description-${descriptionPosition}`]
        )}
      >
        {description}
      </p>
    </div>
  );
}
