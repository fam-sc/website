import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestion, PollQuestionProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionProps<'multicheckbox'>) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'multicheckbox',
        choices: [1, 2, 3].map((i) => ({
          id: i.toString(),
          title: `Choice ${i}`,
        })),
      }}
      answer={{ selectedIndices }}
      onAnswerChanged={({ selectedIndices }) => {
        setSelectedIndices(selectedIndices);
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
