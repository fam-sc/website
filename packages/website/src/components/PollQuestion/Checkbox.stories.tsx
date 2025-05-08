import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestion, PollQuestionProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionProps<'checkbox'>) {
  const [choice, setChoice] = useState<string[]>([]);

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'checkbox',
        options: [1, 2, 3].map((i) => ({
          id: i.toString(),
          title: `Choice ${i}`,
        })),
      }}
      answer={{ selectedIds: choice }}
      onAnswerChanged={({ selectedIds }) => {
        setChoice(selectedIds);
      }}
    />
  );
}
export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    title: 'Title',
  },
};
