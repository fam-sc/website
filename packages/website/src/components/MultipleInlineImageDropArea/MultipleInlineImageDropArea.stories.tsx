import type { Meta, StoryObj } from '@storybook/react';

import { MultipleInlineImageDropArea } from '.';
import { NotificationWrapper } from '../Notification';

export default {
  component: MultipleInlineImageDropArea,
  decorators: [
    (Story) => (
      <NotificationWrapper>
        <Story />
      </NotificationWrapper>
    ),
  ],
} satisfies Meta<typeof MultipleInlineImageDropArea>;

type Story = StoryObj<typeof MultipleInlineImageDropArea>;

export const Primary: Story = {};
