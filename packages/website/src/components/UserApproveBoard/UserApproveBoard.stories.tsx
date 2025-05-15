import type { Meta, StoryObj } from '@storybook/react';

import { UserApproveBoard, UserApproveItemType } from '.';

export default {
  component: UserApproveBoard,
} satisfies Meta<typeof UserApproveBoard>;

type Story = StoryObj<typeof UserApproveBoard>;

function item(index: number): UserApproveItemType {
  return {
    id: index.toString(),
    name: `Name ${index}`,
    group: 'КМ-23',
    email: `someemail${index}@gmail.com`,
    avatarSrc: 'https://i.imgur.com/gbt7JG7.jpg',
  };
}

export const Primary: Story = {
  args: {
    items: [item(1)],
  },
};

export const ManyItems: Story = {
  args: {
    items: [item(1), item(2), item(3)],
  },
};
