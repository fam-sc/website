import {
  PollQuestion,
  PollQuestionType,
  PollRespondentAnswer,
  Repository,
} from '@sc-fam/data';
import {
  getTwoLeggedAccessToken,
  TwoLeggedOptions,
} from '@sc-fam/shared/api/google';
import {
  batchUpdateSpreadsheet,
  CellData,
  Color,
  getSpreadsheet,
  Request,
} from '@sc-fam/shared/api/google/spreadsheets';
import { indexMany } from '@sc-fam/shared/collections';

import { PollExportError, PollExportErrorType } from './error';
import { formatDate, notUndefined } from './utils';

const HEADER_BACKGROUND: Color = {
  red: 102 / 255,
  green: 0,
  blue: 1,
};

type Respondent = {
  date: number;
  answers: PollRespondentAnswer[];
};

type SpreadsheetPoll = {
  questions: PollQuestion[];
  respondents: Respondent[];
};

type CellFormatter<T extends PollQuestionType> = (
  answer: PollRespondentAnswer,
  question: PollQuestion<T>
) => CellData;

type CellFormatterMap = {
  [T in PollQuestionType]: CellFormatter<T>;
};

const cellFormatterMap: CellFormatterMap = {
  text: (answer) => ({
    userEnteredValue: { stringValue: notUndefined(answer, 'text') },
  }),
  score: (answer) => ({
    userEnteredValue: { numberValue: notUndefined(answer, 'selected') },
  }),
  checkbox: (answer) => ({
    userEnteredValue: { boolValue: notUndefined(answer, 'status') },
    dataValidation: {
      condition: {
        type: 'BOOLEAN',
        values: [],
      },
      showCustomUi: true,
    },
  }),
  radio: (answer, question) => ({
    userEnteredValue: {
      stringValue:
        question.options[notUndefined(answer, 'selectedIndex')].title,
    },
  }),
  multicheckbox: (answer, question) => {
    const indices = notUndefined(answer, 'selectedIndices');
    const titles = question.options.map(({ title }) => title);

    return {
      userEnteredValue: {
        stringValue: indexMany(titles, indices).join('; '),
      },
    };
  },
};

function headerRequests(
  poll: Pick<SpreadsheetPoll, 'questions'>,
  sheetId: number
): Request[] {
  const headers = ['Дата', ...poll.questions.map(({ title }) => title)];

  return [
    {
      updateCells: {
        fields: '*',
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: poll.questions.length + 1,
        },
        rows: [
          {
            values: headers.map((text) => ({
              userEnteredValue: { stringValue: text },
              userEnteredFormat: {
                backgroundColorStyle: {
                  rgbColor: HEADER_BACKGROUND,
                },
              },
            })),
          },
        ],
      },
    },
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 1,
          },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    },
  ];
}

function cellData<T extends PollQuestionType>(
  question: PollQuestion<T>,
  answer: PollRespondentAnswer
): CellData {
  return cellFormatterMap[question.type](answer, question);
}

function rowData(
  questions: PollQuestion[],
  respondent: Respondent
): CellData[] {
  const dateCell: CellData = {
    userEnteredValue: {
      stringValue: formatDate(respondent.date),
    },
    userEnteredFormat: {
      numberFormat: {
        type: 'DATE_TIME',
        pattern: 'yyyy-mm-dd hh:MM',
      },
    },
  };

  return [
    dateCell,
    ...respondent.answers.map((answer, i) => cellData(questions[i], answer)),
  ];
}

function dataRequests(
  questions: PollQuestion[],
  newRespondents: Respondent[],
  sheetId: number
): Request[] {
  return [
    {
      appendCells: {
        sheetId,
        rows: newRespondents.map((respondent) => ({
          values: rowData(questions, respondent),
        })),
        fields: '*',
      },
    },
  ];
}

export async function exportPollToSpreadsheetWithAuth(
  pollId: number,
  accessOptions: TwoLeggedOptions
): Promise<void> {
  const access = await getTwoLeggedAccessToken(accessOptions);

  return exportPollToSpreadsheet(pollId, access);
}

export async function exportPollToSpreadsheet(
  pollId: number,
  access: string
): Promise<void> {
  const repo = Repository.openConnection();

  const poll = await repo.polls().findPollForSpreadsheet(pollId);
  if (poll === null) {
    throw new PollExportError('Not found', PollExportErrorType.NOT_FOUND);
  }

  const { spreadsheetId } = poll;
  if (spreadsheetId === null) {
    throw new PollExportError(
      'No linked spreadsheet',
      PollExportErrorType.NO_LINKED_SPREADSHEET
    );
  }

  const spreadsheet = await getSpreadsheet(access, { spreadsheetId });
  const { sheetId } = spreadsheet.sheets[0].properties;

  const requests = [
    ...headerRequests(poll, sheetId),
    ...dataRequests(poll.questions, poll.newRespondents, sheetId),
  ];

  await batchUpdateSpreadsheet(access, { spreadsheetId, requests });

  await repo.pollSpreadsheetEntries().addEntries(
    spreadsheetId,
    poll.newRespondents.map(({ userId }) => userId)
  );
}
