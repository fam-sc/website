import { AnimatedRegistration } from '@/components/AnimatedRegistration';
import { BlockHeader } from '@/components/BlockHeader';

import { BlockContainer } from '../BlockContainer';
import styles from './RegistrationBlock.module.scss';

export function RegistrationBlock() {
  return (
    <BlockContainer className={styles.root}>
      <BlockHeader className={styles.header}>Цей час настав</BlockHeader>

      <AnimatedRegistration className={styles.registration} />
    </BlockContainer>
  );
}
