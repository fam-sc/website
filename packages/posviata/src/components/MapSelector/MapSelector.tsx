import { classNames } from '@sc-fam/shared';
import { useState } from 'react';

import { MapSwiper, type MapType } from '../MapSwiper';
import { OptionSwitch } from '../OptionSwitch';
import styles from './MapSelector.module.scss';

export interface MapSelectorProps {
  className?: string;
}

const options = ['main', 'bbq'] as const;

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

      <MapSwiper selectedType={selectedType} />
    </div>
  );
}
