import type { Meta, StoryObj } from '@storybook/react';

import { GoogleSpreadsheetLinker } from './GoogleSpreadsheetLinker';

export default {
  component: GoogleSpreadsheetLinker,
} satisfies Meta<typeof GoogleSpreadsheetLinker>;

type Story = StoryObj<typeof GoogleSpreadsheetLinker>;

export const Empty: Story = {
  args: {
    actionTitle: 'Вибрати таблицю',
  },
};

export const WithSpreadsheet: Story = {
  args: {
    actionTitle: 'Вибрати таблицю',
    spreadsheet: {
      name: 'Таблиця',
      link: '123',
    },
  },
};
