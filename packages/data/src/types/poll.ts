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

export type PollQuestionOption = {
  title: string;
};

export type PollQuestion = { title: string } & (
  | { type: 'text' }
  | {
      type: 'multicheckbox' | 'radio';
      options: PollQuestionOption[];
    }
  | {
      type: 'checkbox';
      requiredTrue: boolean;
    }
);

export type PollType = PollQuestion['type'];

export type RawPollRespondent = {
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

export type PollRespondentAnswer = {
  // if question's type is input
  text?: string;

  // if question's type is checbox.
  status?: boolean;

  // if question's type is radio.
  selectedIndex?: number;

  // if question's type is multicheckbox.
  selectedIndices?: number[];
};
