import { Choice } from '../../types';
import styles from './index.module.scss';

type OptionGroupProps = {
  choices: Choice[];
  children: (id: string | number, index: number, title: string) => ReactNode;
};

export function OptionGroup({ choices, children }: OptionGroupProps) {
  return (
    <div className={styles['option-group']}>
      {choices.map(({ id, title }, index) => children(id, index, title))}
    </div>
  );
}
