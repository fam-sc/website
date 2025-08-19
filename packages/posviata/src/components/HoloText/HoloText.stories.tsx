import type { Meta, StoryObj } from '@storybook/react';

import { HoloText } from '.';

export default {
  component: HoloText,
} satisfies Meta<typeof HoloText>;

type Story = StoryObj<typeof HoloText>;

export const Primary: Story = {
  args: {
    text: 'ФОТО',
  },
};
