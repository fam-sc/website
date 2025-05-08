import type { Meta, StoryObj } from '@storybook/react';

import { AnswerMap, PollQuestionList, PollQuestionListProps } from '.';
import { useState } from 'react';

function Component(props: PollQuestionListProps) {
  const [answers, setAnswers] = useState<AnswerMap>({});

  return (
    <PollQuestionList
      {...props}
      answers={answers}
      onAnswersChanged={setAnswers}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof PollQuestionList>;

const items = ['1', '2', '3'].map((id) => ({
  id,
  title: `Choice ${id}`,
}));

export const Primary: Story = {
  args: {
    items: [
      {
        key: '1',
        title: 'Question 1',
        descriptor: { type: 'text' },
      },
      {
        key: '2',
        title: 'Question 2',
        descriptor: { type: 'checkbox', options: items },
      },
      {
        key: '3',
        title: 'Question 3',
        descriptor: { type: 'radio', choices: items },
      },
    ],
  },
};
