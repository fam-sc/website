import { classNames } from '@sc-fam/shared';
import React, { ReactNode } from 'react';

import { navigigationSecondaryRoutes } from '@/constants/navigation';
import { InstagramIcon } from '@/icons/InstagramIcon';
import { MailIcon } from '@/icons/MailIcon';
import { QuestionIcon } from '@/icons/QuestionIcon';
import { TelegramIcon } from '@/icons/TelegramIcon';
import { TikTokIcon } from '@/icons/TikTokIcon';
import logo from '@/images/logo.png?w=32!';

import { Link } from '../Link';
import { Typography } from '../Typography';
import styles from './Footer.module.scss';

export interface FooterProps {
  className?: string;
}

type LinkWithIconProps = {
  to: string;
  title?: string;
  small?: boolean;
  children: ReactNode;
};

function LinkWithIcon({ to, small, title, children }: LinkWithIconProps) {
  return (
    <Link
      to={to}
      title={title}
      className={classNames(
        styles['link-with-icon'],
        small && styles['link-with-icon-small']
      )}
    >
      {children}
    </Link>
  );
}

function Section({ children }: React.PropsWithChildren) {
  return <div className={styles.section}>{children}</div>;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={classNames(styles.root, className)}>
      <Section>
        <Typography>Баранівська Валерія</Typography>
        <Typography>Хмарук Олег</Typography>
        <Typography>2025</Typography>
      </Section>

      <Section>
        {navigigationSecondaryRoutes.map((item) => (
          <Link key={item.href} to={item.href}>
            <Typography>{item.title}</Typography>
          </Link>
        ))}
      </Section>

      <Section>
        <Typography as="strong">Підтримка</Typography>

        <LinkWithIcon to="https://t.me/fpm_sc_bot" small>
          <QuestionIcon />
          Чат-бот
        </LinkWithIcon>

        <LinkWithIcon to="/">
          <img src={logo} width={15} height={15} alt="Bot" />
          Про нас
        </LinkWithIcon>
      </Section>

      <Section>
        <Link to="/privacy-policy">
          <Typography as="strong">Політика конфіденційності</Typography>
        </Link>
      </Section>

      <div className={styles.icons}>
        <LinkWithIcon to="mailto:sr.fam.kpi@gmail.com" title="Пошта">
          <MailIcon />
        </LinkWithIcon>

        <LinkWithIcon to="https://www.instagram.com/fam_kpi/" title="Інстаграм">
          <InstagramIcon />
        </LinkWithIcon>

        <LinkWithIcon to="https://t.me/primat_kpi" title="Телеграм">
          <TelegramIcon />
        </LinkWithIcon>

        <LinkWithIcon
          to="https://www.tiktok.com/@fam_kpi?_t=ZM-8vrGKJSe9Rt&_r=1"
          title="Тікток"
        >
          <TikTokIcon />
        </LinkWithIcon>
      </div>
    </footer>
  );
}
