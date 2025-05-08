export type Choice = { id: string; title: string };

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
      choices: Choice[];
    };
    answer: {
      selectedId: string;
    };
  };
  checkbox: {
    descriptor: {
      options: Choice[];
    };
    answer: {
      selectedIds: string[];
    };
  };
};

export type QuestionType = keyof TypeMap;

export type QuestionDescriptor<T extends QuestionType = QuestionType> =
  TypeMap[T]['descriptor'] & {
    type: T;
  };

export type QuestionAnswer<T extends QuestionType = QuestionType> =
  TypeMap[T]['answer'];
