import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestion, PollQuestionProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionProps<'radio'>) {
  const [choice, setChoice] = useState<string | number>('');

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'radio',
        choices: [1, 2, 3].map((i) => ({
          id: i.toString(),
          title: `Choice ${i}`,
        })),
      }}
      answer={{ selectedId: choice }}
      onAnswerChanged={({ selectedId }) => {
        setChoice(selectedId);
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
