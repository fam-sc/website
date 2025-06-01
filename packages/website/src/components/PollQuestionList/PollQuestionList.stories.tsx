import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestionList, PollQuestionListProps } from '.';
import { useState } from 'react';
import { QuestionAnswer } from '../PollQuestion/types';

function Component(props: PollQuestionListProps) {
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

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
        title: 'Question 1',
        descriptor: { type: 'text' },
      },
      {
        title: 'Question 2',
        descriptor: { type: 'multicheckbox', options: items },
      },
      {
        title: 'Question 3',
        descriptor: { type: 'radio', options: items },
      },
    ],
  },
};
