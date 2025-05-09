import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestion, PollQuestionProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionProps<'radio'>) {
  const [status, setStatus] = useState(false);

  return (
    <PollQuestion
      {...props}
      descriptor={{
        type: 'checkbox',
        requiredTrue: false,
      }}
      answer={{ status }}
      onAnswerChanged={({ status }) => {
        setStatus(status);
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
