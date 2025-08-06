import type { Meta, StoryObj } from '@storybook/react';

import { ExportScheduleForm } from './ExportScheduleForm';

export default {
  component: ExportScheduleForm,
} satisfies Meta<typeof ExportScheduleForm>;

type Story = StoryObj<typeof ExportScheduleForm>;

export const Primary: Story = {
  args: {
    options: {
      groupName: 'Group name',
      colors: {
        '1': { foreground: '#ffffff', background: '#000000' },
        '2': { foreground: '#ff0000', background: '#00ff00' },
      },
      initialStartDate: '05-08-2025',
      initialEndDate: '06-08-2025',
    },
  },
};
