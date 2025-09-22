import { ComponentProps } from 'react';

import { Link, LinkProps } from '../Link';
import { Typography, TypographyProps } from '../Typography';

export type OptionalLinkProps =
  | LinkProps
  | (TypographyProps & { to?: null } & ComponentProps<'p'>);

// Renders as <a> if the href is not null, <p> otherwise.
export function OptionalLink(props: OptionalLinkProps) {
  return props.to === null || props.to === undefined ? (
    <Typography {...props} />
  ) : (
    <Link {...(props as LinkProps)} />
  );
}
