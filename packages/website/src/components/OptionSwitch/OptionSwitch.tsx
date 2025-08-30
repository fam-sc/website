import { classNames } from '@sc-fam/shared';
import { ComponentProps, ReactNode, useId } from 'react';

import { WithDataSpace } from '@/types/react';

import { Typography } from '../Typography';
import styles from './OptionSwitch.module.scss';

type OptionArray = readonly [string, string] | readonly [number, number];

export interface OptionSwitchProps<Opts extends OptionArray>
  extends ComponentProps<'ul'>,
    WithDataSpace<'selected'> {
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

  const globalId = useId();

  return (
    <ul
      role="listbox"
      aria-orientation="horizontal"
      aria-multiselectable="false"
      aria-disabled={disabled}
      aria-activedescendant={`${globalId}-${selectedIndex}`}
      className={classNames(
        styles.root,
        selectedIndex === 1 && styles[`root-second`],
        className
      )}
      {...rest}
    >
      {options.map((option, index) => (
        <Typography
          as="li"
          key={option}
          role="option"
          id={`${globalId}-${index}`}
          aria-selected={selectedIndex === index}
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
