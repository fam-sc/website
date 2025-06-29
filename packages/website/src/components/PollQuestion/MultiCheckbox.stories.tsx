import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { PollQuestion, PollQuestionProps } from '.';

function Component(props: PollQuestionProps<'multicheckbox'>) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'multicheckbox',
        options: [1, 2, 3].map((i) => ({
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
