import type { Meta, StoryObj } from '@storybook/react';

import { ExportScheduleDialog } from './ExportScheduleDialog';

export default {
  component: ExportScheduleDialog,
} satisfies Meta<typeof ExportScheduleDialog>;

type Story = StoryObj<typeof ExportScheduleDialog>;

export const Primary: Story = {
  args: {
    group: '52b',
  },
};
