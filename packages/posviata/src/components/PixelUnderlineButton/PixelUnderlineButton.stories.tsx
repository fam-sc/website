import type { Meta, StoryObj } from '@storybook/react';

import { PixelUnderlineButton } from '.';

export default {
  component: PixelUnderlineButton,
} satisfies Meta<typeof PixelUnderlineButton>;

type Story = StoryObj<typeof PixelUnderlineButton>;

export const Primary: Story = {
  args: {
    children: 'Реєстрація',
  },
};
