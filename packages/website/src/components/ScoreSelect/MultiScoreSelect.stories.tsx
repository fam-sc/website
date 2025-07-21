import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ScoreSelect, ScoreSelectProps } from '.';
import { multipleSelection } from './adapter';

function Component(props: ScoreSelectProps<number>) {
  const [selectedItems, setSelectedItems] = useState([1]);

  return (
    <ScoreSelect
      {...props}
      selected={selectedItems}
      onSelectedChanged={setSelectedItems}
      adapter={multipleSelection}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    items: [1, 2, 3, 4, 5],
  },
};

export const Disabled: Story = {
  args: {
    items: [1, 2, 3, 4, 5],
    disabled: true,
  },
};
