import { ReactNode } from 'react';

import { Button, ButtonProps } from '../Button';
import { Link, LinkProps } from '../Link';

export interface LinkButtonProps extends ButtonProps, Omit<LinkProps, 'color'> {
  children?: ReactNode;
}

export function LinkButton(props: LinkButtonProps) {
  return <Button as={Link} {...props} linkVariant="clean" />;
}
