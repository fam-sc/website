import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';
import styles from './SignPageOtherChoice.module.scss';

export interface SignPageOtherChoiceProps extends ComponentProps<'div'> {
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
