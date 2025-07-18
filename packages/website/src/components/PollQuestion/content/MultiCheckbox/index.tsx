import { Checkbox } from '@/components/Checkbox';

import { OptionGroup } from '../OptionGroup';
import { ContentTypeProps } from '../types';

export function MultiCheckboxContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'multicheckbox'>) {
  const selectedIndices = answer?.selectedIndices ?? [];

  return (
    <OptionGroup choices={descriptor.options} {...rest}>
      {(id, index, title) => (
        <Checkbox
          key={id}
          disabled={disabled}
          checked={selectedIndices.includes(index)}
          onCheckedChanged={(state) => {
            onAnswerChanged({
              selectedIndices: state
                ? [...selectedIndices, index]
                : selectedIndices.filter((value) => value !== index),
            });
          }}
        >
          {title}
        </Checkbox>
      )}
    </OptionGroup>
  );
}
