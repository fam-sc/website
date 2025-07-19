import { FC } from 'react';

import {
  QuestionDescriptor,
  QuestionDescriptorContent,
  QuestionType,
} from '@/services/polls/types';

export type ContentTypeProps<T extends QuestionType> = {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  onDescriptorChanged: (value: QuestionDescriptorContent<T>) => void;
};

export type ContentComponent<T extends QuestionType> = FC<ContentTypeProps<T>>;
