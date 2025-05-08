import type { Meta, StoryObj } from '@storybook/react';

import { RadioButton } from '.';

export default {
  component: RadioButton,
} satisfies Meta<typeof RadioButton>;

type Story = StoryObj<typeof RadioButton>;

export const Primary: Story = {
  args: {
    children: 'Some text',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Some text',
  },
};
