import { classNames } from '@sc-fam/shared';

import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';
import styles from './ShortPollInfo.module.scss';

export type ShortPollInfoProps = {
  className?: string;
  title: string;
  href?: string;
};

export function ShortPollInfo({ className, title, href }: ShortPollInfoProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Typography variant="h6">{title}</Typography>

      {href !== undefined ? (
        <LinkButton
          className={styles.linkButton}
          buttonVariant="outlined"
          to={href}
        >
          Пройти опитування
        </LinkButton>
      ) : (
        <Typography>Потрібно зареєструватися, щоб пройти опитування</Typography>
      )}
    </div>
  );
}
