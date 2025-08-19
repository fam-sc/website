import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedRegistrationPattern } from '.';

export default {
  component: AnimatedRegistrationPattern,
} satisfies Meta<typeof AnimatedRegistrationPattern>;

type Story = StoryObj<typeof AnimatedRegistrationPattern>;

export const Primary: Story = {
  args: {
    style: { width: '400px', height: '400px' },
  },
};
