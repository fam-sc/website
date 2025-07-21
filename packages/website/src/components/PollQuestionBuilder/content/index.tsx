import { useCallback } from 'react';

import { Checkbox } from '@/components/Checkbox';
import { ScoreSelect } from '@/components/ScoreSelect';
import { multipleSelection } from '@/components/ScoreSelect/adapter';
import { scores } from '@/services/polls/constants';

import { OptionListBuilder } from '../../OptionListBuilder';
import { ContentComponent, ContentTypeProps } from './types';

function OptionListBuilderContent({
  disabled,
  descriptor: { options },
  onDescriptorChanged,
}: ContentTypeProps<'multicheckbox' | 'radio'>) {
  const onItemsChanged = useCallback(
    (items: string[]) => {
      onDescriptorChanged({
        options: items.map((title, id) => ({ id, title })),
      });
    },
    [onDescriptorChanged]
  );

  return (
    <OptionListBuilder
      disabled={disabled}
      items={options.map(({ title }) => title)}
      onItemsChanged={onItemsChanged}
    />
  );
}

export function CheckboxContent({
  descriptor,
  onDescriptorChanged,
  disabled,
}: ContentTypeProps<'checkbox'>) {
  const onCheckedChanged = useCallback(
    (state: boolean) => {
      onDescriptorChanged({ requiredTrue: state });
    },
    [onDescriptorChanged]
  );

  return (
    <Checkbox
      disabled={disabled}
      checked={descriptor.requiredTrue}
      onCheckedChanged={onCheckedChanged}
    >
      {`Обов'язково має бути включеним`}
    </Checkbox>
  );
}

export function ScoreContent({
  descriptor,
  onDescriptorChanged,
  disabled,
}: ContentTypeProps<'score'>) {
  console.log(descriptor);

  const onSelectedChanged = useCallback(
    (items: number[]) => onDescriptorChanged({ items }),
    [onDescriptorChanged]
  );

  return (
    <ScoreSelect
      adapter={multipleSelection}
      items={scores}
      selected={descriptor.items}
      onSelectedChanged={onSelectedChanged}
      disabled={disabled}
    />
  );
}

export const MultiCheckboxContent =
  OptionListBuilderContent as ContentComponent<'multicheckbox'>;
export const RadioContent =
  OptionListBuilderContent as ContentComponent<'radio'>;
