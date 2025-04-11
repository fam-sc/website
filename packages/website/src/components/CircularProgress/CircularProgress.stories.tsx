import type { Meta, StoryObj } from '@storybook/react';

import { CircularProgress } from '.';

export default {
  component: CircularProgress,
} satisfies Meta<typeof CircularProgress>;

type Story = StoryObj<typeof CircularProgress>;

export const ControlledProgress: Story = {
  args: {
    value: 0.7,
  },
};
