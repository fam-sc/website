import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ModalDialog } from '.';

export default {
  component: ModalDialog,
} satisfies Meta<typeof ModalDialog>;

type Story = StoryObj<typeof ModalDialog>;

export const Primary: Story = {
  args: {
    title: 'Title',
    children: 'Content',
    footer: (
      <>
        <Button>Cancel</Button>
        <Button variant="solid">OK</Button>
      </>
    ),
  },
};
