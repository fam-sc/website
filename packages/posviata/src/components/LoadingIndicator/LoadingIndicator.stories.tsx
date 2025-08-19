import type { Meta, StoryObj } from '@storybook/react';

import { LoadingIndicator } from '.';

export default {
  component: LoadingIndicator,
} satisfies Meta<typeof LoadingIndicator>;

type Story = StoryObj<typeof LoadingIndicator>;

export const Primary: Story = {};
