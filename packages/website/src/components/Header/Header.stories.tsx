import type { Meta, StoryObj } from '@storybook/react';

import { Header } from '.';

export default {
  component: Header,
} satisfies Meta<typeof Header>;

type Story = StoryObj<typeof Header>;

export const PrimaryWithoutUser: Story = {};
export const PrimaryWithUser: Story = { args: { userLogOn: true } };
