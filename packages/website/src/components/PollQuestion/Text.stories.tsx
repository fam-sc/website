import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { PollQuestion, PollQuestionProps } from '.';

function Component(props: PollQuestionProps<'text'>) {
  const [text, setText] = useState<string>('');

  return (
    <PollQuestion
      {...props}
      descriptor={{ type: 'text' }}
      data={null}
      answer={{ text: text }}
      onAnswerChanged={({ text }) => {
        setText(text);
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
