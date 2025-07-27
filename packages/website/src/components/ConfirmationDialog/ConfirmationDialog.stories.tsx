import type { Meta, StoryObj } from '@storybook/react';

import { ConfirmationDialog } from '.';

export default {
  component: ConfirmationDialog,
} satisfies Meta<typeof ConfirmationDialog>;

type Story = StoryObj<typeof ConfirmationDialog>;

export const Primary: Story = {
  args: {
    title: 'Title',
  },
};

export const NoEdit: Story = {
  args: {
    title: 'Title',
  },
};
