import { DragHandleIcon } from '@/icons/DragHandleIcon';

import { BaseIconButtonProps, IconButton } from '../IconButton';

export type DragHandleProps = Omit<BaseIconButtonProps, 'title' | 'children'>;

export function DragHandle(props: DragHandleProps) {
  return (
    <IconButton aria-hidden {...props}>
      <DragHandleIcon />
    </IconButton>
  );
}
