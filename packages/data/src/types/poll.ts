export type Poll = {
  title: string;
  startDate: Date;
  endDate: Date | null;
  questions: PollQuestion[];
  respondents: PollRespondent[];
};

export type ShortPoll = Pick<Poll, 'title' | 'startDate' | 'endDate'>;

export type PollQuestion = { title: string } & 
 ( { type: 'text' } | {
    type: 'multicheckbox' | 'radio';
    options: PollQuestionOption[];
  } | {
    type: 'checkbox';
    requiredTrue: boolean;
  })

export type PollType = PollQuestion['type'];

export type PollQuestionOption = {
  title: string;
};

export type PollRespondent = {
  date: Date;
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
