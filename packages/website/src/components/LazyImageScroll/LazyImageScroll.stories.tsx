import type { Meta, StoryObj } from '@storybook/react';

import { LazyImageScroll } from '.';

export default {
  component: LazyImageScroll,
} satisfies Meta<typeof LazyImageScroll<string>>;

type Story = StoryObj<typeof LazyImageScroll<string>>;

function repeat<T>(item: T, count: number): T[] {
  const result: T[] = [];

  for (let i = 0; i < count; i++) {
    result.push(item);
  }

  return result;
}

function pageRequester(n: number) {
  return (page: number) => {
    return Promise.resolve(
      repeat(
        page % 2 === 0
          ? 'https://i.imgur.com/gbt7JG7.jpg'
          : 'https://i.imgur.com/OEuYkKXl.png',
        n
      )
    );
  };
}

export const LongPages: Story = {
  args: {
    requestPage: pageRequester(40),
    getImageInfo: (value) => value,
  },
};

export const SmallPages: Story = {
  args: {
    requestPage: pageRequester(1),
    getImageInfo: (value) => value,
  },
};
