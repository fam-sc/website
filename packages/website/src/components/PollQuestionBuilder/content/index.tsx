import { Checkbox } from '../../Checkbox';
import { OptionListBuilder } from '../../OptionListBuilder';
import { ContentTypeProps } from './types';

function optionListBuilderWrapper<T extends 'multicheckbox' | 'radio'>(
  type: T
) {
  // eslint-disable-next-line react/display-name
  return ({
    disabled,
    descriptor,
    onDescriptorChanged,
  }: ContentTypeProps<T>) => {
    return (
      <OptionListBuilder
        disabled={disabled}
        items={descriptor.options.map(({ title }) => title)}
        onItemsChanged={(items) => {
          onDescriptorChanged({
            type,
            options: items.map((title, id) => ({ id, title })),
          });
        }}
      />
    );
  };
}

export function CheckboxContent({
  descriptor,
  onDescriptorChanged,
  disabled,
}: ContentTypeProps<'checkbox'>) {
  return (
    <Checkbox
      disabled={disabled}
      checked={descriptor.requiredTrue}
      onCheckedChanged={(state) => {
        onDescriptorChanged({ type: 'checkbox', requiredTrue: state });
      }}
    >
      {`Обов'язково має бути включеним`}
    </Checkbox>
  );
}

export const MultiCheckboxContent = optionListBuilderWrapper('multicheckbox');
export const RadioContent = optionListBuilderWrapper('radio');
