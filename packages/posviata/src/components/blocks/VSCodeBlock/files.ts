import { VSCodeFile } from '@/components/VSCode/types';
import Image1 from '@/images/code/1.jpg';
import Image2 from '@/images/code/2.jpg';
import Image3 from '@/images/code/3.jpg';
import file1 from '@/text/vscode1.md?raw';

export const files: VSCodeFile[] = [
  {
    type: 'image',
    path: 'images/1.jpg',
    url: Image1,
  },
  {
    type: 'image',
    path: 'images/2.jpg',
    url: Image2,
  },
  {
    type: 'image',
    path: 'images/3.jpg',
    url: Image3,
  },
  {
    type: 'markdown',
    path: 'content.md',
    content: file1,
  },
];
