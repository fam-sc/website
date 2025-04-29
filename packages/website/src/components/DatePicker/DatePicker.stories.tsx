import type { Meta, StoryObj } from '@storybook/react';

import { DatePicker } from '.';

export default {
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
