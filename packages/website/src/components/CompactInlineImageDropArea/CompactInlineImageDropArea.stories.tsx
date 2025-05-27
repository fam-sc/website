import type { Meta, StoryObj } from '@storybook/react';

import { CompactInlineImageDropArea, CompactInlineImageDropAreaProps } from '.';

function Component(props: CompactInlineImageDropAreaProps) {
  return (
    <CompactInlineImageDropArea
      {...props}
      onFileChanged={() => Promise.resolve()}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    style: { width: '300px', minHeight: '300px' },
    src: 'https://i.imgur.com/OEuYkKXl.png',
  },
};

export const NoImage: Story = {
  args: {
    style: { width: '300px', minHeight: '300px' },
  },
};
