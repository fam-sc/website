import { ReactNode } from 'react';

import { navigationMainRoutes } from '@/constants/navigation';
import { InstagramIcon } from '@/icons/InstagramIcon';
import { MailIcon } from '@/icons/MailIcon';
import { QuestionIcon } from '@/icons/QuestionIcon';
import { TelegramIcon } from '@/icons/TelegramIcon';
import { TikTokIcon } from '@/icons/TikTokIcon';
import logo from '@/images/logo.png?w=20!';
import { classNames } from '@/utils/classNames';

import { Link } from '../Link';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export interface FooterProps {
  className?: string;
}

const items: { title: string; href: string }[] = [
  { title: 'Головна', href: '/home' },
  ...navigationMainRoutes,
];

type LinkWithIconProps = {
  to: string;
  small?: boolean;
  children: ReactNode;
};

function LinkWithIcon({ to, small, children }: LinkWithIconProps) {
  return (
    <Link
      to={to}
      className={classNames(
        styles['link-with-icon'],
        small && styles['link-with-icon-small']
      )}
    >
      {children}
    </Link>
  );
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={classNames(styles.root, className)}>
      <div className={styles.section}>
        <Typography>Баранівська Валерія</Typography>
        <Typography>Хмарук Олег</Typography>
        <Typography>2025</Typography>
      </div>

      <div className={styles.section}>
        {items.map((item) => (
          <Link key={item.href} to={item.href}>
            <Typography>{item.title}</Typography>
          </Link>
        ))}{' '}
      </div>

      <div className={styles.section}>
        <Typography as="strong">Підтримка</Typography>

        <LinkWithIcon to="https://t.me/fpm_sc_bot" small>
          <QuestionIcon />
          Чат-бот
        </LinkWithIcon>

        <LinkWithIcon to="/home">
          <img src={logo} width={15} height={15} alt="Bot" />
          Про нас
        </LinkWithIcon>
      </div>

      <div className={styles.section}>
        <Link to="/privacy-policy">
          <Typography as="strong">Політика конфіденційності</Typography>
        </Link>
      </div>

      <div className={styles.icons}>
        <LinkWithIcon to="mailto:sr.fam.kpi@gmail.com">
          <MailIcon />
        </LinkWithIcon>

        <LinkWithIcon to="https://www.instagram.com/fam_kpi/">
          <InstagramIcon />
        </LinkWithIcon>
        <LinkWithIcon to="https://t.me/primat_kpi">
          <TelegramIcon />
        </LinkWithIcon>
        <LinkWithIcon to="https://www.tiktok.com/@fam_kpi?_t=ZM-8vrGKJSe9Rt&_r=1">
          <TikTokIcon />
        </LinkWithIcon>
      </div>
    </footer>
  );
}
