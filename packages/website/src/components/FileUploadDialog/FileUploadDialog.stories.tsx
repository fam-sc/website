import type { Meta, StoryObj } from '@storybook/react';

import { FileUploadDialog } from '.';

export default {
  component: FileUploadDialog,
} satisfies Meta<typeof FileUploadDialog>;

type Story = StoryObj<typeof FileUploadDialog>;

export const Primary: Story = {
  args: {
    fileUploadProgress: 0,
  },
};
