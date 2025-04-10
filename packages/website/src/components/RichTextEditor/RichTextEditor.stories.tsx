import type { Meta, StoryObj } from '@storybook/react';

import { RichTextEditor } from '.';

export default {
  component: RichTextEditor,
} satisfies Meta<typeof RichTextEditor>;

type Story = StoryObj<typeof RichTextEditor>;

export const Primary: Story = {
  args: {
    text: '<p>Text</p>',
  },
};
