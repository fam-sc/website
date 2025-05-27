import type { Meta, StoryObj } from '@storybook/react';

import { ShortPollInfo } from '.';

export default {
  component: ShortPollInfo,
} satisfies Meta<typeof ShortPollInfo>;

type Story = StoryObj<typeof ShortPollInfo>;

export const Primary: Story = {
  args: {
    href: '1',
    title: 'Poll 1',
  },
};

export const LongTitle: Story = {
  args: {
    href: '1',
    title:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo obcaecati, odio modi laborum illum quidem praesentium porro veritatis quisquam exercitationem aperiam, similique, inventore ipsa debitis incidunt voluptatibus ea alias nam?',
  },
};
