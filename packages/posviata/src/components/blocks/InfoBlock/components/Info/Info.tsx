import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import { CopyButton } from '@/components/CopyButton';
import { CalendarIcon } from '@/icons/CalendarIcon';
import { ClockIcon } from '@/icons/ClockIcon';
import { LocationIcon } from '@/icons/LocationIcon';
import { PriceIcon } from '@/icons/PriceIcon/PriceIcon';

import styles from './Info.module.scss';

interface ItemProps {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
}

interface ItemWrapperProps {
  href?: string;
  children: ReactNode;
}

function ItemWrapper({ href, children }: ItemWrapperProps) {
  if (href === undefined) {
    return <p className={styles.item}>{children}</p>;
  }

  return (
    <a className={classNames(styles.item, styles['item-link'])} href={href}>
      {children}
    </a>
  );
}

function Item({ title, icon, text, href }: ItemProps) {
  return (
    <ItemWrapper href={href}>
      <span className={styles['item-start']}>{'>'}</span>
      {icon}
      <span className={styles['item-title']}>{`${title}:`}</span>
      <span className={styles['item-text']}>{text}</span>
    </ItemWrapper>
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
      <CopyButton className={styles['exec-copy']} input={command} />
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
      <Item
        icon={<LocationIcon />}
        title="Де"
        text="ВДНГ"
        href="https://maps.app.goo.gl/oWNAA8YnscWjVmWTA?g_st=atm"
      />
      <Item icon={<PriceIcon />} title="Ціна" text="250" />
    </div>
  );
}
