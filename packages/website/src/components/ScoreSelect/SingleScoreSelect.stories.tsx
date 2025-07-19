import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ScoreSelect, ScoreSelectProps } from '.';
import { singleSelection } from './adapter';

function Component(props: ScoreSelectProps<number>) {
  const [selectedItem, setSelectedItem] = useState(props.items[0]);

  return (
    <ScoreSelect
      {...props}
      selected={selectedItem}
      onSelectedChanged={setSelectedItem}
      adapter={singleSelection}
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
