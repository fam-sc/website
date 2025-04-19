import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Dropdown } from '.';

export default {
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

type Story = StoryObj<typeof Dropdown>;

export const BottomLeft: Story = {
  args: {
    position: 'bottom',
    children: <Button>Trigger</Button>,
    items: ['Item 1', 'Item 2', 'Item 3'].map((id) => ({ id })),
    renderItem: ({ id }) => id,
    onAction: (id) => {
      console.log(id);
    },
  },
};

export const BottomRight: Story = {
  args: {
    position: 'bottom',
    style: { float: 'right' },
    children: <Button>Trigger</Button>,
    items: ['Item 11111', 'Item 2', 'Item 3'].map((id) => ({ id })),
    renderItem: ({ id }) => id,
    onAction: (id) => {
      console.log(id);
    },
  },
};

export const LeftRight: Story = {
  args: {
    position: 'left',
    style: { float: 'right' },
    children: <Button>Trigger</Button>,
    items: ['Item 11111', 'Item 2', 'Item 3'].map((id) => ({ id })),
    renderItem: ({ id }) => id,
    onAction: (id) => {
      console.log(id);
    },
  },
};

export const RightLeft: Story = {
  args: {
    position: 'right',
    children: <Button>Trigger</Button>,
    items: ['Item 11111', 'Item 2', 'Item 3'].map((id) => ({ id })),
    renderItem: ({ id }) => id,
    onAction: (id) => {
      console.log(id);
    },
  },
};

export const TopBottom: Story = {
  args: {
    position: 'top',
    style: { position: 'absolute', bottom: 0 },
    children: <Button>Trigger</Button>,
    items: ['Item 11111', 'Item 2', 'Item 3'].map((id) => ({ id })),
    renderItem: ({ id }) => id,
    onAction: (id) => {
      console.log(id);
    },
  },
};
