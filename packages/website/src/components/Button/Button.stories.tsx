import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';

export default {
  component: Button,
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: 'Flat',
  },
};
