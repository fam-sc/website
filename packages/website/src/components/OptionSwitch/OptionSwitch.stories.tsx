import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { OptionSwitch, OptionSwitchProps } from '.';

function GenericSwitch({
  selected: initial,
  ...rest
}: OptionSwitchProps<['first', 'second']>) {
  const [selected, setSelected] = useState(initial);

  return (
    <OptionSwitch
      selected={selected}
      onOptionSelected={setSelected}
      {...rest}
    />
  );
}

export default {
  component: GenericSwitch,
} satisfies Meta<typeof GenericSwitch>;

type Story = StoryObj<typeof GenericSwitch>;

export const Primary: Story = {
  args: {
    options: ['first', 'second'],
    renderOption: (option) => option,
  },
};

export const Disabled: Story = {
  args: {
    options: ['first', 'second'],
    disabled: true,
    renderOption: (option) => option,
  },
};
