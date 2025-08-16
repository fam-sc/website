import React, { Suspense, useState } from 'react';

import { classNames } from '@/utils/classNames';

import { LoadingIndicatorWrapper } from '../LoadingIndicatorWrapper';
import type { MapType } from '../MapSwiper';
import { OptionSwitch } from '../OptionSwitch';
import styles from './MapSelector.module.scss';

export interface MapSelectorProps {
  className?: string;
}

const options = ['main', 'bbq'] as const;

const MapSwiper = React.lazy(async () => {
  const { MapSwiper } = await import('../MapSwiper');

  return { default: MapSwiper };
});

export function MapSelector({ className }: MapSelectorProps) {
  const [selectedType, setSelectedType] = useState<MapType>('main');

  return (
    <div className={classNames(styles.root, className)}>
      <OptionSwitch
        className={styles.switch}
        options={options}
        renderOption={(option) => (option === 'main' ? 'ВДНГ' : 'BBQ Сад')}
        selected={selectedType}
        onOptionSelected={setSelectedType}
      />

      <Suspense fallback={<LoadingIndicatorWrapper />}>
        <MapSwiper
          className={styles.map}
          selectedType={selectedType}
          onSelectedType={setSelectedType}
        />
      </Suspense>
    </div>
  );
}
