import { ReactNode } from 'react';

import { CalendarIcon } from '@/icons/CalendarIcon';
import { ClockIcon } from '@/icons/ClockIcon';
import { LocationIcon } from '@/icons/LocationIcon';
import { PriceIcon } from '@/icons/PriceIcon/PriceIcon';
import { classNames } from '@/utils/classNames';

import styles from './Info.module.scss';

interface ItemProps {
  icon: ReactNode;
  title: string;
  text: string;
}

function Item({ title, icon, text }: ItemProps) {
  return (
    <p className={styles.item}>
      <span className={styles['item-start']}>{'>'}</span>
      {icon}
      <span className={styles['item-title']}>{`${title}:`}</span>
      <span className={styles['icon-text']}>{text}</span>
    </p>
  );
}

interface ExecuteProps {
  command: string;
}

function Execute({ command }: ExecuteProps) {
  return (
    <p className={styles.exec}>
      <span className={styles['exec-start']}>{'>'}</span>
      {command}
    </p>
  );
}

interface InfoProps {
  className?: string;
}

export function Info({ className }: InfoProps) {
  return (
    <div className={classNames(styles.info, className)}>
      <Execute command="curl -s https://posviata.sc-fam.org/info.py | python -" />
      <Item icon={<CalendarIcon />} title="Дата" text="20 вересня" />
      <Item icon={<ClockIcon />} title="Час" text="12:00" />
      <Item icon={<LocationIcon />} title="Де" text="Location" />
      <Item icon={<PriceIcon />} title="Ціна" text="300" />
    </div>
  );
}
