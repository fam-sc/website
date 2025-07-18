import { DragHandleIcon } from '@/icons/DragHandleIcon';
import { PropsMap } from '@/types/react';

import { IconButton } from '../IconButton';

type ButtonProps = PropsMap['button'];

export type DragHandleProps = ButtonProps;

export function DragHandle(props: DragHandleProps) {
  return (
    <IconButton {...props}>
      <DragHandleIcon />
    </IconButton>
  );
}
