import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { OptionListBuilder, OptionListBuilderProps } from '.';

function Component(props: OptionListBuilderProps) {
  const [items, setItems] = useState<string[]>([]);

  return (
    <OptionListBuilder {...props} items={items} onItemsChanged={setItems} />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {};
