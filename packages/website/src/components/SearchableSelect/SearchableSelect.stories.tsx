import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { SearchableSelect, SearchableSelectProps } from '.';

function SelectWithState(props: SearchableSelectProps<string>) {
  const [selectedItem, setSelectedItem] = useState(props.selectedItem);

  return (
    <SearchableSelect
      {...props}
      selectedItem={selectedItem}
      onItemSelected={(item) => {
        setSelectedItem(item);
      }}
    />
  );
}

export default {
  component: SelectWithState,
} satisfies Meta<typeof SelectWithState>;

type Story = StoryObj<typeof SelectWithState>;

const style = { width: '200px' };

function search(item: { title: string }, query: string) {
  return item.title.startsWith(query);
}

export const Primary: Story = {
  args: {
    placeholder: 'Select something',
    style,
    search,
    items: [
      { key: 'item1', title: 'Item1' },
      { key: 'item2', title: 'Item12' },
      {
        key: 'item3',
        title: 'Item123',
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Select something',
    disabled: true,
    style,
    search,
    items: [
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      {
        key: 'item3',
        title: 'Item 3',
      },
    ],
  },
};

export const LongText: Story = {
  args: {
    placeholder: 'Select something',
    style,
    search,
    items: [
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      {
        key: 'item3',
        title: 'Item 3 that is tooooooooooooooooooooooooooooooo long',
      },
    ],
  },
};

export const LongList: Story = {
  args: {
    placeholder: 'Select something',
    style,
    search,
    items: Array.from({ length: 100 }).map((_, index) => ({
      key: index.toString(),
      title: `Item ${index}`,
    })),
  },
};
