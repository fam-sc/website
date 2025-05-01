import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ErrorAlertWrapper, useErrorAlert } from '.';

function Component() {
  const errorAlert = useErrorAlert();

  return (
    <ErrorAlertWrapper>
      <Button
        onClick={() => {
          errorAlert.show('Error');
        }}
      >
        Show
      </Button>
    </ErrorAlertWrapper>
  );
}

export default {
  component: Component,
  decorators: [
    (Story) => {
      return (
        <ErrorAlertWrapper>
          <Story />
        </ErrorAlertWrapper>
      );
    },
  ],
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {};
