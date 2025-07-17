import type { Meta, StoryObj } from '@storybook/react';

import { SignInForm } from '../SignInForm';
import { SignPageOtherChoice } from '../SignPageOtherChoice';
import { SignPageLayout } from '.';

export default {
  component: SignPageLayout,
} satisfies Meta<typeof SignPageLayout>;

type Story = StoryObj<typeof SignPageLayout>;

export const Left: Story = {
  args: {
    main: <SignInForm />,
    mainPosition: 'left',
    other: (
      <SignPageOtherChoice
        href="/"
        action="Зареєструватися"
        title="Ще не з нами?"
      />
    ),
  },
};

export const Right: Story = {
  args: {
    main: <SignInForm />,
    mainPosition: 'right',
    other: (
      <SignPageOtherChoice
        href="/"
        action="Зареєструватися"
        title="Ще не з нами?"
      />
    ),
  },
};
