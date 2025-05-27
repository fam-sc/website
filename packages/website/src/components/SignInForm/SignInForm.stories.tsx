import type { Meta, StoryObj } from '@storybook/react';
import SignInForm from '.';

const meta: Meta<typeof SignInForm> = {
  title: 'Forms/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'centered',
    margin: 'auto',
  },
};

export default meta;
type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {};
