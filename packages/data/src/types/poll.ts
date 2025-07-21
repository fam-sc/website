export type RawPoll = {
  id: number;
  title: string;
  startDate: number;
  endDate: number | null;
  questions: string;
};

export type Poll = Omit<RawPoll, 'questions'> & {
  questions: PollQuestion[];
  respondents: PollRespondent[];
};

export type ShortPoll = Pick<Poll, 'title' | 'startDate' | 'endDate'>;

export type PollWithEndDateAndRespondents = {
  endDate: Date | null;
  respondents: Pick<PollRespondent, 'userId'>[];
};

type OptionContent = {
  options: {
    title: string;
  }[];
};

type PollQuestionContentMap = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  text: {};
  multicheckbox: OptionContent;
  radio: OptionContent;
  checkbox: { requiredTrue: boolean };
  score: { items: number[] };
};

type PollQuestionType = keyof PollQuestionContentMap;

export type PollQuestion<T extends PollQuestionType = PollQuestionType> = {
  [K in T]: { type: K; title: string } & PollQuestionContentMap[K];
}[T];

export type RawPollRespondent = {
  pollId: number;

  // We save userId not to use it in processing,
  // but to disallow posting more than one response with the same account.
  userId: number;
  date: number;
  answers: string;
};

export type PollRespondent = {
  // We save userId not to use it in processing,
  // but to disallow posting more than one response with the same account.
  userId: number;
  date: number;
  answers: PollRespondentAnswer[];
};

export type AnonymousPollRespondent = Omit<PollRespondent, 'userId'>;

export type PollRespondentAnswer = {
  // if question's type is input
  text?: string;

  // if question's type is checbox.
  status?: boolean;

  // if question's type is radio.
  selectedIndex?: number;

  // if question's type is multicheckbox.
  selectedIndices?: number[];

  // if question's type is score.
  selected?: number;
};
