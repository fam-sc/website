import { useCallback } from 'react';

import { ScoreSelect } from '@/components/ScoreSelect';
import { singleSelection } from '@/components/ScoreSelect/adapter';

import { ContentTypeProps } from '../types';

export function ScoreContent({
  descriptor,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'score'>) {
  const onSelectedChanged = useCallback(
    (selected: number) => {
      onAnswerChanged({ selected });
    },
    [onAnswerChanged]
  );

  return (
    <ScoreSelect
      items={descriptor.items}
      adapter={singleSelection}
      selected={answer?.selected ?? descriptor.items[0]}
      onSelectedChanged={onSelectedChanged}
      {...rest}
    />
  );
}
