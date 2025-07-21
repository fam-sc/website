import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { QuestionBuildItem } from '@/services/polls/buildItem';

import { PollQuestionBuilder, PollQuestionBuilderProps } from '.';

function Component(props: PollQuestionBuilderProps) {
  const [value, setValue] = useState<QuestionBuildItem>({ key: 1, title: '' });

  return (
    <PollQuestionBuilder
      {...props}
      value={value}
      onValueChanged={(changes) => {
        setValue((value) => ({ ...value, ...changes }));
      }}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {},
};

export const Error: Story = {
  args: {
    isError: true,
  },
};
