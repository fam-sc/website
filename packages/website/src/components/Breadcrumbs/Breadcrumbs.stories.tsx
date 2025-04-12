import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs } from '.';

export default {
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

type Story = StoryObj<typeof Breadcrumbs>;

export const TwoItems: Story = {
  args: {
    items: [
      {
        title: 'Page 1',
        href: '/page1',
      },
      {
        title: 'Page 2',
        href: '/page2',
      },
    ],
  },
};

export const ThreeItems: Story = {
  args: {
    items: [
      {
        title: 'Page 1',
        href: '/page1',
      },
      {
        title: 'Page 2',
        href: '/page2',
      },
      {
        title: 'Page 3',
        href: '/page3',
      },
    ],
  },
};
