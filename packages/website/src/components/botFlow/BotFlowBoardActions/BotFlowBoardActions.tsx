import { classNames } from '@sc-fam/shared';
import { IconButton, IconButtonProps } from '@sc-fam/shared-ui';

import { Dropdown } from '@/components/Dropdown';
import { Typography } from '@/components/Typography';
import { PlusIcon } from '@/icons/PlusIcon';
import { SaveIcon } from '@/icons/SaveIcon';

import { NodeType } from '../BotFlowBoard/types';
import styles from './BotFlowBoardActions.module.scss';

export type BotFlowBoardActionsProps = {
  isChanged: boolean;
  onAdd?: (type: NodeType) => void;
  onSave?: () => void;
};

const nodeLabels: Record<NodeType, string> = {
  step: 'Step',
  option: 'Option',
  receptacle: 'Receptacle',
};

function ActionButton({ className, ...rest }: IconButtonProps) {
  return (
    <IconButton
      className={classNames(styles['action-button'], className)}
      {...rest}
    />
  );
}

export function BotFlowBoardActions({
  isChanged,
  onAdd,
  onSave,
}: BotFlowBoardActionsProps) {
  return (
    <div className={styles.root}>
      {isChanged && (
        <Typography className={styles['changed-status']}>
          Не збережено
        </Typography>
      )}

      <ActionButton title="Зберегти" onClick={onSave} disabled={!isChanged}>
        <SaveIcon />
      </ActionButton>

      <Dropdown
        position="bottom"
        alignment="high"
        items={Object.keys(nodeLabels).map((id) => ({ id: id as NodeType }))}
        onAction={(key) => onAdd?.(key)}
        renderItem={({ id }) => nodeLabels[id]}
      >
        <ActionButton title="Додати елемент">
          <PlusIcon />
        </ActionButton>
      </Dropdown>
    </div>
  );
}
