import type { Meta, StoryObj } from '@storybook/react';

import { ShortPollInfoList } from '.';

export default {
  component: ShortPollInfoList,
} satisfies Meta<typeof ShortPollInfoList>;

type Story = StoryObj<typeof ShortPollInfoList>;

function item(id: number) {
  return {
    id,
    title: `Event ${id}`,
    href: id.toString(),
  };
}

export const SingleItem: Story = {
  args: {
    items: [item(1)],
  },
};

export const OneRow: Story = {
  args: {
    items: [item(1), item(2), item(3)],
  },
};

export const TwoRows: Story = {
  args: {
    items: [item(1), item(2), item(3), item(4), item(5), item(6)],
  },
};
