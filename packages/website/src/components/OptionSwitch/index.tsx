import { ReactNode } from 'react';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type OptionArray = readonly [string, string] | readonly [number, number];
type ListProps = PropsMap['ul'];

export interface OptionSwitchProps<Opts extends OptionArray> extends ListProps {
  options: Opts;
  selected?: Opts[0 | 1];
  renderOption: (option: Opts[0 | 1]) => ReactNode;
  onOptionSelected?: (value: Opts[0 | 1]) => void;

  disabled?: boolean;
}

export function OptionSwitch<const Opts extends OptionArray>({
  options,
  selected,
  onOptionSelected,
  renderOption,
  className,
  disabled,
  ...rest
}: OptionSwitchProps<Opts>) {
  const selectedIndex =
    selected === undefined || options[0] === selected ? 0 : 1;

  return (
    <ul
      role="switch"
      aria-checked={selectedIndex === 0}
      aria-disabled={disabled}
      className={classNames(styles.root, className)}
      data-selected={selectedIndex}
      {...rest}
    >
      {options.map((option, index) => (
        <Typography
          as="li"
          key={option}
          onClick={() => {
            onOptionSelected?.(options[index]);
          }}
        >
          {renderOption(option)}
        </Typography>
      ))}
    </ul>
  );
}
