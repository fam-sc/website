import { FC } from 'react';

import { PlusIcon } from '@/icons/PlusIcon';
import { SaveIcon } from '@/icons/SaveIcon';
import { SvgProps } from '@/icons/types';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { ButtonProps } from '../../Button';
import { Dropdown } from '../../Dropdown';
import { IconButton } from '../../IconButton';
import { NodeType } from '../BotFlowBoard/types';
import styles from './index.module.scss';

export type BotFlowBoardActionsProps = {
  isChanged: boolean;
  onAdd?: (type: NodeType) => void;
  onSave?: () => void;
};

type ActionButtonProps = PropsMap['button'] &
  ButtonProps & {
    icon: FC<SvgProps>;
  };

const nodeLabels: Record<NodeType, string> = {
  step: 'Step',
  option: 'Option',
  receptacle: 'Receptacle',
};

function ActionButton({ icon: Icon, ...rest }: ActionButtonProps) {
  return (
    <IconButton
      className={classNames(styles['action-button'], rest.className)}
      {...rest}
    >
      <Icon />
    </IconButton>
  );
}

export function BotFlowBoardActions({
  isChanged,
  onAdd,
  onSave,
}: BotFlowBoardActionsProps) {
  return (
    <div className={styles.root}>
      {isChanged && <p className={styles['changed-status']}>Not saved</p>}

      <ActionButton icon={SaveIcon} onClick={onSave} />

      <Dropdown
        position="bottom"
        items={Object.keys(nodeLabels).map((id) => ({ id: id as NodeType }))}
        onAction={(key) => onAdd?.(key)}
        renderItem={({ id }) => nodeLabels[id]}
      >
        <ActionButton icon={PlusIcon} />
      </Dropdown>
    </div>
  );
}
