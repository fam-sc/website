import { ReactNode } from 'react';

import { CalendarIcon } from '@/icons/CalendarIcon';
import { ClockIcon } from '@/icons/ClockIcon';
import { LocationIcon } from '@/icons/LocationIcon';
import { PriceIcon } from '@/icons/PriceIcon';
import { classNames } from '@/utils/classNames';

import styles from './Info.module.scss';

interface IconTextProps {
  icon: ReactNode;
  title: string;
  text: string;
}

function IconText({ title, icon, text }: IconTextProps) {
  return (
    <div className={styles.item}>
      {icon}

      <div className={styles['item-content']}>
        <p className={styles['item-title']}>{title}</p>
        <p className={styles['icon-text']}>{text}</p>
      </div>
    </div>
  );
}

interface InfoProps {
  className?: string;
}

export function Info({ className }: InfoProps) {
  return (
    <div className={classNames(styles.info, className)}>
      <IconText icon={<CalendarIcon />} title="Дата" text="20 вересня" />
      <IconText icon={<ClockIcon />} title="Час" text="12:00" />
      <IconText icon={<LocationIcon />} title="Де" text="Location" />
      <IconText icon={<PriceIcon />} title="Ціна" text="300" />
    </div>
  );
}
