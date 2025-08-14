import { AnimatedRegistration } from '@/components/AnimatedRegistration';

import { BlockContainer } from '../BlockContainer';
import styles from './FooterBlock.module.scss';

export function FooterBlock() {
  return (
    <BlockContainer className={styles.root}>
      <AnimatedRegistration className={styles.registration} />
    </BlockContainer>
  );
}
