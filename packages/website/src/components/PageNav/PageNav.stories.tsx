import type { Meta, StoryObj } from '@storybook/react';

import { PageNav } from '.';

export default {
  component: PageNav,
} satisfies Meta<typeof PageNav>;

type Story = StoryObj<typeof PageNav>;

export const Primary: Story = {
  args: {
    current: 2,
    total: 5,
    getLink: () => '#',
  },
};
