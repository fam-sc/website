import { RegistrationClickPlace } from '@/campaign/types';
import { classNames } from '@/utils/classNames';

import { RegistrationButton } from '../RegistrationButton';
import { Typography, TypographyProps } from '../Typography';
import styles from './PixelUnderlineButton.module.scss';

export interface PixelUnderlineButtonProps extends TypographyProps {
  className?: string;
  children: string;
}

export function PixelUnderlineButton({
  className,
  children,
  ...rest
}: PixelUnderlineButtonProps) {
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
