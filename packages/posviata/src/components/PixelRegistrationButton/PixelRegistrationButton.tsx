import { classNames } from '@sc-fam/shared';

import { RegistrationClickPlace } from '@/campaign/types';

import { RegistrationButton } from '../RegistrationButton';
import { Typography, TypographyProps } from '../Typography';
import styles from './PixelRegistrationButton.module.scss';

export interface PixelRegistrationButtonProps extends TypographyProps {
  className?: string;
  children: string;
}

export function PixelRegistrationButton({
  className,
  children,
  ...rest
}: PixelRegistrationButtonProps) {
  return (
    <Typography
      as={RegistrationButton}
      font="press-start"
      className={classNames(styles.root, className)}
      place={RegistrationClickPlace.HEADER}
      {...rest}
    >
      {children}
    </Typography>
  );
}
