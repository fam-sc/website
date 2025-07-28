import type { Meta, StoryObj } from '@storybook/react';

import { GuideListItem } from '.';

export default {
  component: GuideListItem,
} satisfies Meta<typeof GuideListItem>;

type Story = StoryObj<typeof GuideListItem>;

export const Primary: Story = {
  args: {
    slug: '1',
    createdAt: '11 травня',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit praesentium, esse dolores officia qui quidem animi ea doloremque suscipit neque laboriosam natus perferendis consequuntur ad, cum id quae sint molestias.',
    images: [
      {
        src: 'https://i.imgur.com/OEuYkKXl.png',
        width: 634,
        height: 640,
      },
    ],
    title: 'Guide title',
  },
};

export const NoImage: Story = {
  args: {
    slug: '1',
    createdAt: '11 травня',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit praesentium, esse dolores officia qui quidem animi ea doloremque suscipit neque laboriosam natus perferendis consequuntur ad, cum id quae sint molestias.',
    images: null,
    title: 'Guide title',
  },
};
