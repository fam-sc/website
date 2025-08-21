import { VSCode } from '@/components/VSCode';

import { BlockContainer } from '../BlockContainer';
import { files } from './files';
import styles from './VSCodeBlock.module.scss';

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
