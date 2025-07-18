import { AriaAttributes, FC } from 'react';

import { QuestionAnswer, QuestionDescriptor, QuestionType } from '../types';

export interface ContentTypeProps<T extends QuestionType = QuestionType>
  extends AriaAttributes {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
}

export type ContentComponentMap = Omit<
  {
    [T in QuestionType]: FC<ContentTypeProps<T>>;
  },
  'checkbox'
>;
