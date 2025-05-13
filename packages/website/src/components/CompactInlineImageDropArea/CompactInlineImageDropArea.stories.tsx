import type { Meta, StoryObj } from '@storybook/react';

import { CompactInlineImageDropArea, CompactInlineImageDropAreaProps } from '.';
import { NotificationWrapper } from '../Notification';

function Component(props: CompactInlineImageDropAreaProps) {
  return (
    <CompactInlineImageDropArea
      {...props}
      onFileChanged={() => Promise.resolve()}
    />
  );
}

export default {
  component: Component,
  decorators: [
    (Story) => (
      <NotificationWrapper>
        <Story />
      </NotificationWrapper>
    ),
  ],
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    style: { width: '300px', height: '300px' },
    src: 'https://i.imgur.com/OEuYkKXl.png',
  },
};

export const NoImage: Story = {
  args: {
    style: { width: '300px', height: '300px' },
  },
};
