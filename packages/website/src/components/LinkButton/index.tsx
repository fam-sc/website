import { ReactNode } from 'react';

import { Button, ButtonProps } from '../Button';
import { Link, LinkProps } from '../Link';

export type LinkButtonProps = LinkProps &
  ButtonProps & {
    children?: ReactNode;
  };

export function LinkButton(props: LinkButtonProps) {
  return <Button as={Link} {...props} linkVariant="clean" />;
}
