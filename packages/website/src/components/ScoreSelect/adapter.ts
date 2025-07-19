import { PropsMap } from '@/types/react';

export type InputType = PropsMap['input']['type'];

export type ScoreSelectAdapter<T> = {
  inputType: InputType;

  isChecked: (selected: T, value: number) => boolean;
  onCheckedSelected: (selected: T, value: number, checked: boolean) => T;
};

export const singleSelection: ScoreSelectAdapter<number> = {
  inputType: 'radio',
  isChecked: (selected, value) => selected === value,
  onCheckedSelected: (selected, value, checked) => (checked ? value : selected),
};

export const multipleSelection: ScoreSelectAdapter<number[]> = {
  inputType: 'checkbox',
  isChecked: (selected, value) => selected.includes(value),
  onCheckedSelected: (selected, value, checked) => {
    const uniqueItems = new Set(selected);

    if (checked) {
      uniqueItems.add(value);
    } else {
      uniqueItems.delete(value);
    }

    return [...uniqueItems].sort((a, b) => a - b);
  },
};
