import type { Meta, StoryObj } from '@storybook/react';

import { InlineImageDropArea, InlineImageDropAreaProps } from '.';
import { useObjectUrl } from '@/hooks/useObjectUrl';

function Component(props: InlineImageDropAreaProps) {
  const [image, setImage] = useObjectUrl();

  return (
    <InlineImageDropArea
      {...props}
      imageSrc={image}
      onFile={(file) => {
        setImage(file && { url: URL.createObjectURL(file), type: 'object' });
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
