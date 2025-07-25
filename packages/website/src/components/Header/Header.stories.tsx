import { UserRole } from '@sc-fam/data';
import type { Meta, StoryObj } from '@storybook/react';

import { AuthProvider } from '@/auth/context';

import { Header } from '.';

export default {
  component: Header,
} satisfies Meta<typeof Header>;

type Story = StoryObj<typeof Header>;

export const PrimaryWithoutUser: Story = {
  decorators: [
    (Story) => (
      <AuthProvider value={{ user: null }}>
        <Story />
      </AuthProvider>
    ),
  ],
};

export const PrimaryWithUser: Story = {
  decorators: [
    (Story) => (
      <AuthProvider
        value={{ user: { id: 1, role: UserRole.ADMIN, hasAvatar: false } }}
      >
        <Story />
      </AuthProvider>
    ),
  ],
};
