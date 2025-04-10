import type { Meta, StoryObj } from '@storybook/react';

import { SelectLinkDialog } from '.';

export default {
  component: SelectLinkDialog,
} satisfies Meta<typeof SelectLinkDialog>;

type Story = StoryObj<typeof SelectLinkDialog>;

export const Primary: Story = {
  args: {
  },
};
