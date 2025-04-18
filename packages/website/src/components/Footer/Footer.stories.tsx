import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from '.';

export default {
  component: Footer,
} satisfies Meta<typeof Footer>;

type Story = StoryObj<typeof Footer>;

export const Primary: Story = {
  args: {},
};
