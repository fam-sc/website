import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  TwoPartColor,
  TwoPartColorSelector,
  TwoPartColorSelectorProps,
} from './TwoPartColorSelector';

function Component(props: TwoPartColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<TwoPartColor>();

  return (
    <TwoPartColorSelector
      {...props}
      selectedColor={selectedColor}
      onSelectedColor={setSelectedColor}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    colors: [
      { foreground: '#ffffff', background: '#000000' },
      { foreground: '#ff0000', background: '#00ff00' },
    ],
  },
};
