import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';

export default {
  component: Button,
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: 'Solid',
  },
};

export const SolidDisabled: Story = {
  args: {
    variant: 'solid',
    disabled: true,
    children: 'Solid',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    variant: 'outlined',
    disabled: true,
    children: 'Outlined',
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: 'Flat',
  },
};

export const FlatDisabled: Story = {
  args: {
    variant: 'flat',
    disabled: true,
    children: 'Flat',
  },
};
