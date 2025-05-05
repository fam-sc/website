import type { Meta, StoryObj } from '@storybook/react';

import { EventWithId, SelectEventDialog } from '.';

type Story = StoryObj<typeof SelectEventDialog>;

export default {
  component: SelectEventDialog,
} satisfies Meta<typeof SelectEventDialog>;

function generateEvents(n: number): EventWithId[] {
  const result: EventWithId[] = [];

  for (let i = 1; i <= n; i++) {
    result.push({ id: i.toString(), title: `Event ${i}` });
  }

  return result;
}

export const Primary: Story = {
  args: {
    events: generateEvents(3),
  },
};

export const ManyItems: Story = {
  args: {
    events: generateEvents(10),
  },
};

export const Loading: Story = {
  args: {
    events: undefined,
  },
};
