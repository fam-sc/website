import { FC } from 'react';

import { ImageTypeIcon } from '@/icons/ImageTypeIcon';
import { MarkdownIcon } from '@/icons/MarkdownTypeIcon';
import { SvgProps } from '@/icons/types';

import { VSCodeFileType } from '../../types';

const icons: Record<VSCodeFileType, FC> = {
  image: ImageTypeIcon,
  markdown: MarkdownIcon,
};

export interface FileTypeIcon extends SvgProps {
  type: VSCodeFileType;
}

export function FileTypeIcon({ type, ...rest }: FileTypeIcon) {
  const Icon = icons[type];

  return <Icon {...rest} />;
}
