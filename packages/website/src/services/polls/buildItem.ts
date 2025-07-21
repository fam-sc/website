import { QuestionDescriptor } from '@/services/polls/types';

export type QuestionBuildItem = {
  key: string | number;
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
      return descriptor.options.length > 0;
    }
    case 'score': {
      return descriptor.items.length > 0;
    }
    default: {
      return true;
    }
  }
}
