import { ChainedCommands } from '@tiptap/core';
import { FC, useCallback } from 'react';

import { AlignCenterIcon } from '@/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/icons/AlignRightIcon';
import { SvgProps } from '@/icons/types';

import { Alignment } from '../types';
import { ToggleButton } from './ToggleButton';

const alignmentInfo: Record<Alignment, { icon: FC<SvgProps>; title: string }> =
  {
    left: { icon: AlignLeftIcon, title: 'Вирівнювання по лівому краю' },
    center: { icon: AlignCenterIcon, title: 'Вирівнювання по центру' },
    right: { icon: AlignRightIcon, title: 'Вирівнювання по правому краю' },
    justify: { icon: AlignJustifyIcon, title: 'Вирівнювання по ширині' },
  };

export interface TextAlignButtonProps {
  alignment: Alignment;
  isActive: boolean;
}

export function TextAlignButton({ alignment, isActive }: TextAlignButtonProps) {
  const { title, icon: Icon } = alignmentInfo[alignment];
  const onToggle = useCallback(
    (c: ChainedCommands) => c.setTextAlign(alignment),
    [alignment]
  );

  return (
    <ToggleButton isActive={isActive} title={title} onToggle={onToggle}>
      <Icon />
    </ToggleButton>
  );
}
