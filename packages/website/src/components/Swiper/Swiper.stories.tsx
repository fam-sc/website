import type { Meta, StoryObj } from '@storybook/react';
import { Key } from 'react';

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
    renderSlide: ({ src }) => <img src={src} draggable={false} />,
  },
};
