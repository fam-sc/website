import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';
import styles from './index.module.scss';

type DivProps = PropsMap['div'];

export interface SignPageOtherChoiceProps extends DivProps {
  title: string;
  href: string;
  action: string;
}

export function SignPageOtherChoice({
  title,
  href,
  action,
  className,
  ...rest
}: SignPageOtherChoiceProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <Typography as="strong" variant="h4">
        {title}
      </Typography>

      <LinkButton buttonVariant="outlined" to={href}>
        {action}
      </LinkButton>
    </div>
  );
}
