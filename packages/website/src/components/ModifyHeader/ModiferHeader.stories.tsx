import type { Meta, StoryObj } from '@storybook/react';

import { ModifyHeader } from '.';

export default {
  component: ModifyHeader,
} satisfies Meta<typeof ModifyHeader>;

type Story = StoryObj<typeof ModifyHeader>;

export const Primary: Story = {
  args: {
    title: 'Title',
    canEdit: true,
  },
};

export const NoEdit: Story = {
  args: {
    title: 'Title',
    canEdit: false,
  },
};
