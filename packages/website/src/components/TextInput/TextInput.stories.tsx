import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from '.';

export default {
  component: TextInput,
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<typeof TextInput>;

export const Primary: Story = {
  args: {
    value: 'Text',
  },
};
