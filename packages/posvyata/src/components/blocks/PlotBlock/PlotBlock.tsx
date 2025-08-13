import { ReactNode } from 'react';

import { CalendarIcon } from '@/icons/CalendarIcon';
import { ClockIcon } from '@/icons/ClockIcon';

import { BlockContainer } from '../BlockContainer';
import { Header } from './components/Header';
import styles from './PlotBlock.module.scss';
import { LocationIcon } from '@/icons/LocationIcon';
import { PriceIcon } from '@/icons/PriceIcon';

interface IconTextProps {
  children: ReactNode;
}

function IconText({ children }: IconTextProps) {
  return <p className={styles['icon-text']}>{children}</p>;
}

export function PlotBlock() {
  return (
    <BlockContainer className={styles.root}>
      <Header />

      <div className={styles.info}>
        <IconText>
          <CalendarIcon />
          20 вересня
        </IconText>

        <IconText>
          <ClockIcon />
          12:00
        </IconText>

        <IconText>
          <LocationIcon />
          Location
        </IconText>

        <IconText>
          <PriceIcon />
          300
        </IconText>
      </div>
    </BlockContainer>
  );
}
