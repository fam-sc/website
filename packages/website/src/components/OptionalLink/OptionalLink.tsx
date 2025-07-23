import { PropsMap } from '@/types/react';

import { Link, LinkProps } from '../Link';
import { Typography, TypographyProps } from '../Typography';

export type OptionalLinkProps =
  | (LinkProps & { to: string })
  | (TypographyProps & { to: null } & PropsMap['p']);

// Renders as <a> if the href is not null, <p> otherwise.
export function OptionalLink(props: OptionalLinkProps) {
  return props.to === null ? <Typography {...props} /> : <Link {...props} />;
}
