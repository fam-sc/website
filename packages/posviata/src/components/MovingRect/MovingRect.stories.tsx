import type { Meta, StoryObj } from '@storybook/react';

import { MovingRect } from '.';

export default {
  component: MovingRect,
} satisfies Meta<typeof MovingRect>;

type Story = StoryObj<typeof MovingRect>;

export const Primary: Story = {
  args: {
    style: {
      width: '400px',
      height: '400px',
      fill: 'transparent',
      stroke: '#fff',
      strokeWidth: 0.01,
    },
  },
};
