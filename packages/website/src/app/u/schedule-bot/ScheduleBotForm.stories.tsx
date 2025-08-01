import type { Meta, StoryObj } from '@storybook/react';

import { ScheduleBotForm } from './ScheduleBotForm';

export default {
  component: ScheduleBotForm,
} satisfies Meta<typeof ScheduleBotForm>;

type Story = StoryObj<typeof ScheduleBotForm>;

export const Primary: Story = {
  args: {
    initial: {
      notificationEnabled: true,
      startTime: null,
      endTime: 100,
    },
  },
};
