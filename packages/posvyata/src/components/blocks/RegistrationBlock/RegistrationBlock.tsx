import { AnimatedRegistration } from '@/components/AnimatedRegistration';

import { BlockContainer } from '../BlockContainer';
import styles from './RegistrationBlock.module.scss';

export function RegistrationBlock() {
  return (
    <BlockContainer className={styles.root}>
      <AnimatedRegistration className={styles.registration} />
    </BlockContainer>
  );
}
