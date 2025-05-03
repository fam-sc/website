import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { NotificationWrapper, NotificationType, useNotification } from '.';

function Component({ type }: { type: NotificationType }) {
  const notification = useNotification();

  return (
    <NotificationWrapper>
      <Button
        onClick={() => {
          notification.show('Message', type);
        }}
      >
        Show
      </Button>
    </NotificationWrapper>
  );
}

export default {
  component: Component,
  decorators: [
    (Story) => {
      return (
        <NotificationWrapper>
          <Story />
        </NotificationWrapper>
      );
    },
  ],
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Plain: Story = {
  args: {
    type: 'plain',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
  },
};
