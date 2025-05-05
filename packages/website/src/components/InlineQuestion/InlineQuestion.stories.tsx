import type { Meta, StoryObj } from '@storybook/react';

import { InlineQuestion, InlineQuestionProps } from '.';
import { Button } from '../Button';

function Component(props: InlineQuestionProps) {
  return (
    <InlineQuestion {...props} questionText="Question">
      <Button>Open</Button>
    </InlineQuestion>
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Left: Story = {};
export const Right: Story = {
  args: {
    position: 'right',
    style: {
      width: 'fit-content',
      float: 'right',
    },
  },
};
