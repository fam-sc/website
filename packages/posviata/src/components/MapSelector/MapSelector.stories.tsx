import type { Meta, StoryObj } from '@storybook/react';

import { MapSelector } from '.';

export default {
  component: MapSelector,
} satisfies Meta<typeof MapSelector>;

type Story = StoryObj<typeof MapSelector>;

export const Primary: Story = {
  args: {},
};
