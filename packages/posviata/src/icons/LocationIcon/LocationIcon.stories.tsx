import type { Meta, StoryObj } from '@storybook/react';

import { LocationIcon } from '.';

export default {
  component: LocationIcon,
} satisfies Meta<typeof LocationIcon>;

type Story = StoryObj<typeof LocationIcon>;

export const Primary: Story = {
  args: {
    style: { width: '40px', height: '40px' },
  },
};
