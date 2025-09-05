import { BaseIconButtonProps, IconButton } from '@sc-fam/shared-ui';

import { DragHandleIcon } from '@/icons/DragHandleIcon';

export type DragHandleProps = Omit<BaseIconButtonProps, 'title' | 'children'>;

export function DragHandle(props: DragHandleProps) {
  return (
    <IconButton aria-hidden {...props}>
      <DragHandleIcon />
    </IconButton>
  );
}
