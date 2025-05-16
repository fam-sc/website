import type { Meta, StoryObj } from '@storybook/react';

import { DataLoadingContainer } from '.';
import { NotificationWrapper } from '../Notification';
import { useDataLoader } from '@/hooks/useDataLoader';
import { delay } from '@/utils/delay';

function Component({ loader }: { loader: () => Promise<string> }) {
  const [state, onRetry] = useDataLoader(loader, []);

  return (
    <DataLoadingContainer value={state} onRetry={onRetry}>
      {(value) => value}
    </DataLoadingContainer>
  );
}

export default {
  component: Component,
  decorators: [
    (Story) => (
      <NotificationWrapper>
        <Story />
      </NotificationWrapper>
    ),
  ],
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Infinite: Story = {
  args: {
    // Never resolving promise
    loader: () => new Promise(() => {}),
  },
};

export const ErrorStory: Story = {
  args: {
    loader: async () => {
      await delay(2000);
      throw new Error('error');
    },
  },
};

export const Success: Story = {
  args: {
    loader: async () => {
      await delay(1000);

      return '123';
    },
  },
};
