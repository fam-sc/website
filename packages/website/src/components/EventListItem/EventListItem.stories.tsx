import type { Meta, StoryObj } from '@storybook/react';

import { EventListItem } from '.';
import { EventStatus } from '@data/types';

export default {
  component: EventListItem,
} satisfies Meta<typeof EventListItem>;

type Story = StoryObj<typeof EventListItem>;

export const Primary: Story = {
  args: {
    id: 1,
    date: '11 травня',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit praesentium, esse dolores officia qui quidem animi ea doloremque suscipit neque laboriosam natus perferendis consequuntur ad, cum id quae sint molestias.',
    images: [
      {
        src: 'https://i.imgur.com/OEuYkKXl.png',
        width: 634,
        height: 640,
      },
    ],
    status: EventStatus.ENDED,
    title: 'Event title',
  },
};
