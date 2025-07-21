import { useCallback } from 'react';

import { TextArea } from '@/components/TextArea';

import { ContentTypeProps } from '../types';

export function TextContent({
  disabled,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'text'>) {
  const onTextChanged = useCallback(
    (text: string) => {
      onAnswerChanged({ text });
    },
    [onAnswerChanged]
  );

  return (
    <TextArea
      disabled={disabled}
      value={answer?.text}
      onTextChanged={onTextChanged}
      {...rest}
    />
  );
}
