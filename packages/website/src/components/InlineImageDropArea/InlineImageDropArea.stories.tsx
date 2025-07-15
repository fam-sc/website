import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { InlineImageDropArea, InlineImageDropAreaProps } from '.';

function Component(props: InlineImageDropAreaProps) {
  const [image, setImage] = useState<string>();

  return (
    <InlineImageDropArea
      {...props}
      image={image}
      onFile={(file) => {
        setImage(file && URL.createObjectURL(file));
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
    style: { height: '400px' },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    style: { height: '400px' },
  },
};
