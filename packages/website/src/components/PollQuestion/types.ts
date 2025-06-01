export type Choice = { id: string | number; title: string };

type TypeMap = {
  text: {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    descriptor: {};
    answer: {
      text: string;
    };
  };
  radio: {
    descriptor: {
      options: Choice[];
    };
    answer: {
      selectedIndex: number | undefined;
    };
  };
  multicheckbox: {
    descriptor: {
      options: Choice[];
    };
    answer: {
      selectedIndices: number[];
    };
  };
  checkbox: {
    descriptor: {
      requiredTrue: boolean;
    };
    answer: {
      status: boolean;
    };
  };
};

export type QuestionType = keyof TypeMap;

export type QuestionDescriptor<T extends QuestionType = QuestionType> = {
  [K in T]: TypeMap[K]['descriptor'] & {
    type: K;
  };
}[T];

export type QuestionAnswer<T extends QuestionType = QuestionType> =
  TypeMap[T]['answer'];
