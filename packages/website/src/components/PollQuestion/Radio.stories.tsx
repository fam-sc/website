import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { PollQuestion, PollQuestionProps } from '.';

function Component(props: PollQuestionProps<'radio'>) {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'radio',
        options: [1, 2, 3].map((i) => ({
          id: i.toString(),
          title: `Choice ${i}`,
        })),
      }}
      answer={{ selectedIndex }}
      onAnswerChanged={({ selectedIndex }) => {
        setSelectedIndex(selectedIndex);
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
