import type { Meta, StoryObj } from '@storybook/react';

import { RichText } from '.';
import { testRichText } from './guideTest';

export default {
  component: RichText,
} satisfies Meta<typeof RichText>;

type Story = StoryObj<typeof RichText>;

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const OnlyText: Story = {
  args: {
    text: LOREM,
  },
};

export const All: Story = {
  args: {
    text: {
      name: 'div',
      children: [
        {
          name: 'p',
          children: [LOREM],
        },
        {
          name: 'p',
          children: [
            'Some text ',
            { name: 'strong', children: ['Bold'] },
            ' ',
            { name: 'i', children: ['Italic'] },
            ' ',
            { name: 'a', attrs: { href: '/page' }, children: ['Link'] },
          ],
        },
        { name: 'h1', children: ['Header 1'] },
        { name: 'h2', children: ['Header 2'] },
        { name: 'h3', children: ['Header 3'] },
        { name: 'h4', children: ['Header 4'] },
        { name: 'h5', children: ['Header 5'] },
        { name: 'h6', children: ['Header 6'] },
        {
          name: 'ul',
          children: [
            { name: 'li', children: ['Item 1'] },
            { name: 'li', children: ['Item 2'] },
            { name: 'li', children: ['Item 3'] },
          ],
        },
        {
          name: 'ol',
          children: [
            { name: 'li', children: ['Item 1'] },
            { name: 'li', children: ['Item 2'] },
            { name: 'li', children: ['Item 3'] },
          ],
        },
        { name: 'hr' },
        {
          name: 'blockquote',
          children: [LOREM],
        },
      ],
    },
  },
};

export const Guide: Story = {
  args: {
    text: testRichText,
  },
};
