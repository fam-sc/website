import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { SlugInput, SlugInputProps } from '.';

function Component(props: SlugInputProps) {
  const [slug, setSlug] = useState('');

  return <SlugInput {...props} slug={slug} onSlugChanged={setSlug} />;
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    slugContent: 'слаг контент',
  },
};

export const Disabled: Story = {
  args: {
    slugContent: 'слаг контент',
  },
};
