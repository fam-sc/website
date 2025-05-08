import type { Meta, StoryObj } from '@storybook/react';

import { PollQuestionBuilder, PollQuestionBuilderProps } from '.';
import { useState } from 'react';
import { QuestionBuildItem } from './item';

function Component(props: PollQuestionBuilderProps) {
  const [value, setValue] = useState<QuestionBuildItem>({ title: '' });

  return (
    <PollQuestionBuilder {...props} value={value} onValueChanged={setValue} />
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
