import type { Meta, StoryObj } from '@storybook/react';

import { InteractiveMainMap } from '.';

export default {
  component: InteractiveMainMap,
} satisfies Meta<typeof InteractiveMainMap>;

type Story = StoryObj<typeof InteractiveMainMap>;

export const Primary: Story = {
  args: {
    style: {
      width: '400px',
      height: '400px',
    },
  },
};
