import type { Meta, StoryObj } from '@storybook/react';
import SignUpForm from '.';

const meta: Meta<typeof SignUpForm> = {
  title: 'Forms/SignUpForm',
  component: SignUpForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {};
