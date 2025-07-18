import {
  QuestionDescriptor,
  QuestionType,
} from '@/components/PollQuestion/types';

export type ContentTypeProps<T extends QuestionType> = {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  onDescriptorChanged: (value: QuestionDescriptor<T>) => void;
};
