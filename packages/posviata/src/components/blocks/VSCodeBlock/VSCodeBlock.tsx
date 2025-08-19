import { VSCode } from '@/components/VSCode';
import { VSCodeFile } from '@/components/VSCode/types';
import Image1 from '@/images/code/1.jpg';
import file1 from '@/text/vscode1.md?raw';

import { BlockContainer } from '../BlockContainer';
import styles from './VSCodeBlock.module.scss';

const files: VSCodeFile[] = [
  {
    type: 'image',
    path: 'images/1.jpg',
    url: Image1,
  },
  {
    type: 'markdown',
    path: 'content.md',
    content: file1,
  },
];

export function VSCodeBlock() {
  return (
    <BlockContainer className={styles.root}>
      <VSCode
        className={styles.code}
        projectName="POSVIATA"
        files={files}
        initialOpenedFile="content.md"
      />
    </BlockContainer>
  );
}
