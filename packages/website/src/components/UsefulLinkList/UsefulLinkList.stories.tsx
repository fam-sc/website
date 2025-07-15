import type { Meta, StoryObj } from '@storybook/react';

import { UsefulLinkList } from '.';

export default {
  component: UsefulLinkList,
} satisfies Meta<typeof UsefulLinkList>;

type Story = StoryObj<typeof UsefulLinkList>;

export const Primary: Story = {
  args: {
    items: [1, 2, 3, 4, 5, 6, 8].map((index) => ({
      id: index.toString(),
      href: '/',
      imageSrc: 'https://i.imgur.com/gbt7JG7.jpg',
      title: `Item ${index}`,
    })),
  },
};
