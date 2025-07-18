import { Link } from '@/components/Link';
import { Typography } from '@/components/Typography';
import { MarkdownConfig } from '@/types/markdown/config';

export const paragraph: MarkdownConfig['paragraph'] = Typography;

export const header: MarkdownConfig['header'] = ({ level, children }) => (
  <Typography variant={`h${level}`}>{children}</Typography>
);

export const anchor: MarkdownConfig['anchor'] = ({ href, children }) => (
  <Link to={href}>{children}</Link>
);

export const listItem: MarkdownConfig['listItem'] = ({ children }) => (
  <Typography as="li">{children}</Typography>
);
