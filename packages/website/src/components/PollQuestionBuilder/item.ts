import { QuestionDescriptor } from '../PollQuestion/types';

export type QuestionBuildItem = {
  title: string;
  descriptor?: QuestionDescriptor;
};

export function isValidItem({ title, descriptor }: QuestionBuildItem): boolean {
  if (title.length === 0 || descriptor === undefined) {
    return false;
  }

  switch (descriptor.type) {
    case 'multicheckbox':
    case 'radio': {
      return descriptor.choices.length > 0;
    }
    default: {
      return true;
    }
  }
}
