import type { Meta, StoryObj } from '@storybook/react';

import { UserAvatarOrPlaceholder } from '.';

export default {
  component: UserAvatarOrPlaceholder,
} satisfies Meta<typeof UserAvatarOrPlaceholder>;

type Story = StoryObj<typeof UserAvatarOrPlaceholder>;

export const Primary: Story = {
  args: {
    style: { width: '6em', height: '6em' },
    src: 'https://i.imgur.com/OEuYkKXl.png',
  },
};

export const NoAvatar: Story = {
  args: {
    style: { width: '6em', height: '6em' },
    src: undefined,
  },
};
