import { Key } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Swiper } from '.';

export default {
  component: Swiper,
} satisfies Meta<typeof Swiper>;

type Story = StoryObj<typeof Swiper<{ id: Key; src: string }>>;

export const Primary: Story = {
  args: {
    slides: [
      'https://i.imgur.com/iYaYJc0.png',
      'https://i.imgur.com/towPadb.png',
      'https://i.imgur.com/zVs0WyF.png',
    ].map((src) => ({ id: src, src })),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    renderSlide: ({ src }) => <img src={src} draggable={false} />,
  },
};
