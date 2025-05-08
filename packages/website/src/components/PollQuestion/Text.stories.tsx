import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestion, PollQuestionProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionProps<'text'>) {
  const [text, setText] = useState<string>('');

  return (
    <PollQuestion<'text'>
      {...props}
      descriptor={{ type: 'text' }}
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
