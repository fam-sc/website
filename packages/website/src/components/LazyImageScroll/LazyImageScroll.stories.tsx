import type { Meta, StoryObj } from '@storybook/react';

import { LazyImageScroll } from '.';
import { NotificationWrapper } from '../Notification';

export default {
  component: LazyImageScroll,
  decorators: [
    (Story) => (
      <NotificationWrapper>
        <Story />
      </NotificationWrapper>
    ),
  ],
} satisfies Meta<typeof LazyImageScroll<string>>;

type Story = StoryObj<typeof LazyImageScroll<string>>;

function repeat<T>(item: T, count: number): T[] {
  const result: T[] = [];

  for (let i = 0; i < count; i++) {
    result.push(item);
  }

  return result;
}

function requestPage(page: number) {
  return Promise.resolve(
    repeat(
      page % 2 === 0
        ? 'https://i.imgur.com/gbt7JG7.jpg'
        : 'https://i.imgur.com/OEuYkKXl.png',
      40
    )
  );
}

export const Primary: Story = {
  args: {
    requestPage,
    getImageSource: (value) => value,
  },
};
