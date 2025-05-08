import type { Meta, StoryObj } from '@storybook/react';

import { PollBuilder, PollBuilderProps } from '.';
import { useState } from 'react';
import { QuestionBuildItem } from '../PollQuestionBuilder/item';

function Component(props: PollBuilderProps) {
  const [items, setItems] = useState<QuestionBuildItem[]>([]);

  return <PollBuilder {...props} items={items} onItemsChanged={setItems} />;
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {},
};
