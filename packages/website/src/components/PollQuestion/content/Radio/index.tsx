import { RadioButton } from '@/components/RadioButton';

import { OptionGroup } from '../OptionGroup';
import { ContentTypeProps } from '../types';

export function RadioContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'radio'>) {
  return (
    <OptionGroup choices={descriptor.options} {...rest}>
      {(id, index, title) => (
        <RadioButton
          key={id}
          disabled={disabled}
          checked={answer?.selectedIndex === index}
          onCheckedChanged={(state) => {
            if (state) {
              onAnswerChanged({ selectedIndex: index });
            }
          }}
        >
          {title}
        </RadioButton>
      )}
    </OptionGroup>
  );
}
