import type { Meta, StoryObj } from '@storybook/react';

import { TextWithImage } from '.';

export default {
  component: TextWithImage,
} satisfies Meta<typeof TextWithImage>;

type Story = StoryObj<typeof TextWithImage>;

export const Primary: Story = {
  args: {
    title: 'Цей час настав!',
    subtext:
      'Заповни цю коротку форму та очікуй на фідбек, щоб стати частиною нашої команди;)',
    image: {
      src: 'https://i.imgur.com/XbYCFta.png',
      alt: '',
      width: 1820,
      height: 1956,
    },
    button: {
      title: 'Стань частиною команди!',
      href: '#',
    },
  },
};
