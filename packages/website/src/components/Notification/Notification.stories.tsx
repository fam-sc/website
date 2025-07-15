import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { NotificationType, NotificationWrapper, useNotification } from '.';

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
