import type { Meta, StoryObj } from '@storybook/react';

import { PriceIcon } from '.';

export default {
  component: PriceIcon,
} satisfies Meta<typeof PriceIcon>;

type Story = StoryObj<typeof PriceIcon>;

export const Primary: Story = {
  args: {
    style: { width: '40px', height: '40px' },
  },
};
