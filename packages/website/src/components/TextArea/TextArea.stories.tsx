import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TextArea, TextAreaProps } from '.';

function StatefulTextArea({ value, ...rest }: TextAreaProps) {
  const [text, setText] = useState(value);

  return <TextArea value={text} onTextChanged={setText} {...rest} />;
}

export default {
  component: StatefulTextArea,
} satisfies Meta<typeof StatefulTextArea>;

type Story = StoryObj<typeof StatefulTextArea>;

export const Primary: Story = {
  args: {
    value: 'Some text',
  },
};
