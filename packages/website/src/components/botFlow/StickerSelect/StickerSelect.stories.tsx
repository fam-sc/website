import type { Meta, StoryObj } from '@storybook/react';

import { StickerSelect } from '.';

export default {
  component: StickerSelect,
} satisfies Meta<typeof StickerSelect>;

type Story = StoryObj<typeof StickerSelect>;

export const Primary: Story = {
  args: {},
};
