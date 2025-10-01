import { object, string } from 'zod/v4-mini';

export const setPollSpreadsheetPayload = object({
  spreadsheetId: string(),
});
