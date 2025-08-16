import { AnimatedRegistration } from '@/components/AnimatedRegistration';

import { BlockContainer } from '../BlockContainer';
import styles from './RegistrationBlock.module.scss';

export function RegistrationBlock() {
  return (
    <BlockContainer className={styles.root}>
      <h2 className={styles.header}>Цей час настав</h2>

      <AnimatedRegistration className={styles.registration} />
    </BlockContainer>
  );
}
