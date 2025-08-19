import type { Meta, StoryObj } from '@storybook/react';

import { InteractiveBbqMap } from '.';

export default {
  component: InteractiveBbqMap,
} satisfies Meta<typeof InteractiveBbqMap>;

type Story = StoryObj<typeof InteractiveBbqMap>;

export const Primary: Story = {
  args: {
    style: {
      width: '400px',
      height: '400px',
    },
  },
};
