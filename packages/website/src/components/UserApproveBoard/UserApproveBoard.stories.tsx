import type { Meta, StoryObj } from '@storybook/react';

import { UserApproveBoard, UserApproveItemType } from '.';

export default {
  component: UserApproveBoard,
} satisfies Meta<typeof UserApproveBoard>;

type Story = StoryObj<typeof UserApproveBoard>;

function item(index: number, hasAvatar: boolean = true): UserApproveItemType {
  return {
    id: index.toString(),
    name: `Name ${index}`,
    group: 'КМ-23',
    email: `someemail${index}@gmail.com`,
    avatarSrc: hasAvatar ? 'https://i.imgur.com/gbt7JG7.jpg' : undefined,
  };
}

export const Primary: Story = {
  args: {
    items: [item(1)],
  },
};

export const ManyItems: Story = {
  args: {
    items: [item(1), item(2), item(3), item(4, false)],
  },
};
