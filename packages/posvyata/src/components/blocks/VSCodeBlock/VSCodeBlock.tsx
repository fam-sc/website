import { VSCode } from '@/components/VSCode';
import { VSCodeFile } from '@/components/VSCode/types';
import Image1 from '@/images/code/1.jpg';

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
    content: '123',
  },
];

export function VSCodeBlock() {
  return (
    <BlockContainer className={styles.root}>
      <VSCode
        className={styles.code}
        projectName="POSVYATA"
        files={files}
        initialOpenedFile="content.md"
      />
    </BlockContainer>
  );
}
