import { classNames } from '@/utils/classNames';
import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export type ShortPollInfoProps = {
  className?: string;
  title: string;
  href: string;
};

export function ShortPollInfo({ className, title, href }: ShortPollInfoProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Typography variant="h6">{title}</Typography>

      <LinkButton
        className={styles.linkButton}
        buttonVariant="outlined"
        href={href}
      >
        Пройти опитування
      </LinkButton>
    </div>
  );
}
