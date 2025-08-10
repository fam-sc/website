import type { Meta, StoryObj } from '@storybook/react';

import Image1 from '@/images/code/1.jpg';
import { RawMarkdownNodeType } from '@/utils/markdown/types';

import { VSCode } from '.';

export default {
  component: VSCode,
} satisfies Meta<typeof VSCode>;

type Story = StoryObj<typeof VSCode>;

export const Primary: Story = {
  args: {
    projectName: 'posvyata',
    style: { height: '100dvh' },
    initialOpenedFile: 'folder/file1.md',
    files: [
      {
        path: 'folder/file1.md',
        type: 'markdown',
        content: ['123', { type: RawMarkdownNodeType.BREAK_LINE }, '456'],
      },
      {
        path: 'folder/file2.md',
        type: 'markdown',
        content: '123',
      },
      {
        path: 'file1.png',
        type: 'image',
        url: Image1,
      },
    ],
  },
};
