import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { getEmptyAnswer } from '@/services/polls/answer';

import { QuestionAnswer } from '../../services/polls/types';
import { PollQuestionList, PollQuestionListProps } from '.';

function Component(props: PollQuestionListProps) {
  const [answers, setAnswers] = useState<QuestionAnswer[]>(() =>
    props.items.map(({ descriptor }) => getEmptyAnswer(descriptor.type))
  );

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
      {
        title: 'Question 4',
        descriptor: { type: 'checkbox', requiredTrue: false },
      },
      {
        title: 'Question 5',
        descriptor: { type: 'score', items: [1, 2, 3, 4, 5] },
      },
    ],
  },
};
