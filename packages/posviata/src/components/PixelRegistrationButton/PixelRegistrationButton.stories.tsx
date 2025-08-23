import type { Meta, StoryObj } from '@storybook/react';

import { PixelRegistrationButton } from '.';

export default {
  component: PixelRegistrationButton,
} satisfies Meta<typeof PixelRegistrationButton>;

type Story = StoryObj<typeof PixelRegistrationButton>;

export const Primary: Story = {
  args: {
    children: 'Реєстрація',
  },
};
