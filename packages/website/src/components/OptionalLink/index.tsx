import { Link, LinkProps } from '../Link';
import { Typography, TypographyProps } from '../Typography';

import { PropsMap } from '@/types/react';

export type OptionalLinkProps =
  | (LinkProps & { href: string } & PropsMap['a'])
  | (TypographyProps & { href: null } & PropsMap['p']);

// Renders as <a> if the href is not null, <p> otherwise.
export function OptionalLink(props: OptionalLinkProps) {
  return props.href === null ? <Typography {...props} /> : <Link {...props} />;
}
