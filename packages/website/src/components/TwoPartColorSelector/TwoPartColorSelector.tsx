import { classNames } from '@sc-fam/shared';

import styles from './TwoPartColorSelector.module.scss';

export type TwoPartColor = {
  foreground: string;
  background: string;
};

export interface TwoPartColorSelectorProps<
  C extends TwoPartColor = TwoPartColor,
> {
  colors: C[];
  selectedColor?: NoInfer<C>;
  onSelectedColor?: (value: C) => void;
}

export function TwoPartColorSelector<C extends TwoPartColor>({
  colors,
  selectedColor,
  onSelectedColor,
}: TwoPartColorSelectorProps<C>) {
  return (
    <div className={styles.root}>
      {colors.map((color) => (
        <div
          key={`${color.background}${color.foreground}`}
          style={{
            '--background': color.background,
            '--foreground': color.foreground,
          }}
          onClick={() => onSelectedColor?.(color)}
          className={classNames(
            styles.item,
            selectedColor &&
              selectedColor.foreground === color.foreground &&
              selectedColor.background === color.background &&
              styles['item-selected']
          )}
        >
          <span className={styles['item-content']} />
        </div>
      ))}
    </div>
  );
}
